import "server-only";
import { and, eq, gte, inArray, lt, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  addons,
  approvals,
  bookingAddons,
  bookingSeries,
  bookings,
  organizations,
  resources,
  sites,
  users,
  type Resource,
} from "@/db/schema";
import {
  APPROVAL_TIMEOUT_MS,
  MAX_RECURRENCE_OCCURRENCES,
} from "@/lib/constants";
import { expandOccurrences, minutesBetween } from "@/lib/datetime";
import { AppError, isOverlapError } from "@/lib/errors";
import { writeAudit } from "@/services/audit.service";
import { enqueueEmail } from "@/services/email.service";
import type { SessionUser } from "@/lib/session";

export type Guest = { name: string; email?: string };
export type AddonLineInput = { addonId: string; quantity: number };

function needsApproval(
  resource: Resource,
  threshold: number,
  addonRequiresApproval: boolean,
) {
  if (addonRequiresApproval) return true;
  return resource.kind === "room" && resource.capacity > threshold;
}

function assertPolicies(resource: Resource, start: Date, end: Date) {
  if (end <= start) {
    throw new AppError(422, "INVALID_RANGE", "End must be after start.");
  }
  const duration = minutesBetween(start, end);
  if (duration > resource.maxDurationMinutes) {
    throw new AppError(
      422,
      "MAX_DURATION",
      `Maximum duration is ${resource.maxDurationMinutes} minutes.`,
    );
  }
  const lead = minutesBetween(new Date(), start);
  if (lead < resource.minLeadMinutes) {
    throw new AppError(
      422,
      "LEAD_TIME",
      `Book at least ${resource.minLeadMinutes} minutes ahead.`,
    );
  }
}

async function loadAddons(orgId: string, lines: AddonLineInput[]) {
  if (lines.length === 0) return [];
  const ids = lines.map((line) => line.addonId);
  const rows = await db
    .select()
    .from(addons)
    .where(and(eq(addons.orgId, orgId), inArray(addons.id, ids)));
  const byId = new Map(rows.map((row) => [row.id, row]));
  return lines.map((line) => {
    const addon = byId.get(line.addonId);
    if (!addon || !addon.active) {
      throw new AppError(422, "UNKNOWN_ADDON", "Add-on is not available.");
    }
    if (line.quantity < 1 || line.quantity > 99) {
      throw new AppError(422, "INVALID_QTY", "Quantity must be between 1 and 99.");
    }
    return { addon, quantity: line.quantity };
  });
}

export async function searchAvailability(input: {
  orgId: string;
  siteId?: string;
  kind?: string;
  start: Date;
  end: Date;
  capacity?: number;
}) {
  const conditions = [
    eq(resources.orgId, input.orgId),
    eq(resources.active, true),
  ];
  if (input.siteId) conditions.push(eq(resources.siteId, input.siteId));
  if (input.kind) conditions.push(eq(resources.kind, input.kind));
  if (input.capacity) conditions.push(gte(resources.capacity, input.capacity));

  const catalog = await db
    .select({ resource: resources, site: sites })
    .from(resources)
    .innerJoin(sites, eq(resources.siteId, sites.id))
    .where(and(...conditions));

  const busy = await db
    .select({
      resourceId: bookings.resourceId,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.orgId, input.orgId),
        sql`${bookings.status} in ('confirmed','pending_approval')`,
        lt(bookings.startAt, input.end),
        gte(bookings.endAt, input.start),
      ),
    );

  const busySet = new Set(busy.map((row) => row.resourceId));
  return catalog
    .filter((row) => !busySet.has(row.resource.id))
    .map((row) => ({
      ...row.resource,
      siteName: row.site.name,
      timezone: row.site.timezone,
    }));
}

export async function createBooking(input: {
  actor: SessionUser;
  resourceId: string;
  title: string;
  start: Date;
  end: Date;
  guests?: Guest[];
  chargeCode?: string;
  addonLines?: AddonLineInput[];
  recurrence?: { freq: "daily" | "weekly"; count: number };
}) {
  const resource = await db.query.resources.findFirst({
    where: and(
      eq(resources.id, input.resourceId),
      eq(resources.orgId, input.actor.orgId),
    ),
  });
  if (!resource || !resource.active) {
    throw new AppError(404, "NOT_FOUND", "Resource not found.");
  }

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, input.actor.orgId),
  });
  if (!org) throw new AppError(404, "NOT_FOUND", "Organization not found.");

  const loadedAddons = await loadAddons(input.actor.orgId, input.addonLines ?? []);
  const addonRequiresApproval = loadedAddons.some((line) => line.addon.requiresApproval);
  const pending = needsApproval(
    resource,
    org.approvalCapacityThreshold,
    addonRequiresApproval,
  );
  const status = pending ? "pending_approval" : "confirmed";

  if (input.recurrence) {
    if (resource.kind !== "room") {
      throw new AppError(422, "RECURRENCE_ROOMS_ONLY", "Recurring series are rooms only.");
    }
    if (input.recurrence.count < 2 || input.recurrence.count > MAX_RECURRENCE_OCCURRENCES) {
      throw new AppError(
        422,
        "RECURRENCE_LIMIT",
        `Series must be between 2 and ${MAX_RECURRENCE_OCCURRENCES} occurrences.`,
      );
    }
  }

  const windows = input.recurrence
    ? expandOccurrences(
        input.start,
        input.end,
        input.recurrence.freq,
        input.recurrence.count,
      )
    : [{ start: input.start, end: input.end }];

  for (const window of windows) {
    assertPolicies(resource, window.start, window.end);
  }

  try {
    const created = await db.transaction(async (tx) => {
      let seriesId: string | null = null;
      if (input.recurrence) {
        const [series] = await tx
          .insert(bookingSeries)
          .values({
            orgId: input.actor.orgId,
            resourceId: resource.id,
            organizerUserId: input.actor.id,
            freq: input.recurrence.freq,
            occurrenceCount: input.recurrence.count,
          })
          .returning();
        seriesId = series.id;
      }

      const inserted = [];
      for (const window of windows) {
        const [booking] = await tx
          .insert(bookings)
          .values({
            orgId: input.actor.orgId,
            resourceId: resource.id,
            organizerUserId: input.actor.id,
            seriesId,
            title: input.title.trim(),
            guests: input.guests ?? [],
            chargeCode: input.chargeCode?.trim() || null,
            status,
            startAt: window.start,
            endAt: window.end,
          })
          .returning();
        inserted.push(booking);

        if (loadedAddons.length) {
          await tx.insert(bookingAddons).values(
            loadedAddons.map((line) => ({
              orgId: input.actor.orgId,
              bookingId: booking.id,
              addonId: line.addon.id,
              quantity: line.quantity,
              fulfillment: "requested" as const,
            })),
          );
        }

        if (pending) {
          await tx.insert(approvals).values({
            orgId: input.actor.orgId,
            bookingId: booking.id,
            status: "pending",
            dueAt: new Date(Date.now() + APPROVAL_TIMEOUT_MS),
          });
        }
      }

      return inserted;
    });

    const first = created[0];
    await writeAudit({
      orgId: input.actor.orgId,
      actorUserId: input.actor.id,
      action: pending ? "booking.requested" : "booking.confirmed",
      entity: "booking",
      entityId: first.id,
      payload: { count: created.length, resourceId: resource.id },
    });

    await enqueueEmail({
      orgId: input.actor.orgId,
      toEmail: input.actor.email,
      template: pending ? "booking.pending" : "booking.confirmed",
      payload: {
        title: input.title,
        resource: resource.name,
        start: input.start.toISOString(),
      },
    });

    if (pending) {
      const facilities = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.orgId, input.actor.orgId),
            or(eq(users.role, "facilities_admin"), eq(users.role, "org_admin")),
          ),
        );
      for (const admin of facilities) {
        await enqueueEmail({
          orgId: input.actor.orgId,
          toEmail: admin.email,
          template: "approval.requested",
          payload: { title: input.title, resource: resource.name },
        });
      }
    }

    return created;
  } catch (error) {
    if (isOverlapError(error)) {
      throw new AppError(409, "SLOT_TAKEN", "That slot was just taken.");
    }
    throw error;
  }
}

export async function listBookings(input: {
  actor: SessionUser;
  mine?: boolean;
  status?: string;
}) {
  const conditions = [eq(bookings.orgId, input.actor.orgId)];
  if (input.mine || input.actor.role === "employee") {
    conditions.push(eq(bookings.organizerUserId, input.actor.id));
  }
  if (input.status) conditions.push(eq(bookings.status, input.status));

  return db
    .select({
      booking: bookings,
      resource: resources,
      site: sites,
      organizer: users,
    })
    .from(bookings)
    .innerJoin(resources, eq(bookings.resourceId, resources.id))
    .innerJoin(sites, eq(resources.siteId, sites.id))
    .innerJoin(users, eq(bookings.organizerUserId, users.id))
    .where(and(...conditions))
    .orderBy(bookings.startAt);
}

export async function cancelBooking(input: {
  actor: SessionUser;
  bookingId: string;
}) {
  const row = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.id, input.bookingId),
      eq(bookings.orgId, input.actor.orgId),
    ),
  });
  if (!row) throw new AppError(404, "NOT_FOUND", "Booking not found.");

  const isOwner = row.organizerUserId === input.actor.id;
  const isAdmin =
    input.actor.role === "facilities_admin" ||
    input.actor.role === "org_admin" ||
    input.actor.role === "platform_admin";
  if (!isOwner && !isAdmin) {
    throw new AppError(403, "FORBIDDEN", "You cannot cancel this booking.");
  }
  if (row.status !== "confirmed" && row.status !== "pending_approval") {
    throw new AppError(422, "NOT_CANCELLABLE", "This booking cannot be cancelled.");
  }

  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, row.resourceId),
  });
  if (!resource) throw new AppError(404, "NOT_FOUND", "Resource not found.");

  const minutesToStart = minutesBetween(new Date(), row.startAt);
  if (!isAdmin && minutesToStart < resource.cancelCutoffMinutes) {
    throw new AppError(
      422,
      "CANCEL_CUTOFF",
      `Cancellations close ${resource.cancelCutoffMinutes} minutes before start.`,
    );
  }

  await db
    .update(bookings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookings.id, row.id));

  await writeAudit({
    orgId: input.actor.orgId,
    actorUserId: input.actor.id,
    action: "booking.cancelled",
    entity: "booking",
    entityId: row.id,
  });

  await enqueueEmail({
    orgId: input.actor.orgId,
    toEmail: input.actor.email,
    template: "booking.cancelled",
    payload: { title: row.title },
  });

  return { ok: true };
}

export async function decideBooking(input: {
  actor: SessionUser;
  bookingId: string;
  decision: "approved" | "declined";
  reason?: string;
}) {
  if (
    input.actor.role !== "facilities_admin" &&
    input.actor.role !== "org_admin" &&
    input.actor.role !== "platform_admin"
  ) {
    throw new AppError(403, "FORBIDDEN", "Facilities only.");
  }

  const row = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.id, input.bookingId),
      eq(bookings.orgId, input.actor.orgId),
    ),
  });
  if (!row) throw new AppError(404, "NOT_FOUND", "Booking not found.");
  if (row.status !== "pending_approval") {
    throw new AppError(422, "NOT_PENDING", "This booking is not awaiting approval.");
  }

  const nextStatus = input.decision === "approved" ? "confirmed" : "declined";
  await db.transaction(async (tx) => {
    await tx
      .update(bookings)
      .set({ status: nextStatus, updatedAt: new Date() })
      .where(eq(bookings.id, row.id));
    await tx
      .update(approvals)
      .set({
        status: input.decision,
        decidedByUserId: input.actor.id,
        decidedAt: new Date(),
        reason: input.reason ?? null,
        updatedAt: new Date(),
      })
      .where(eq(approvals.bookingId, row.id));
  });

  await writeAudit({
    orgId: input.actor.orgId,
    actorUserId: input.actor.id,
    action: `booking.${input.decision}`,
    entity: "booking",
    entityId: row.id,
    payload: { reason: input.reason },
  });

  const organizer = await db.query.users.findFirst({
    where: eq(users.id, row.organizerUserId),
  });
  if (organizer) {
    await enqueueEmail({
      orgId: input.actor.orgId,
      toEmail: organizer.email,
      template: `booking.${input.decision}`,
      payload: { title: row.title, reason: input.reason },
    });
  }

  return { ok: true, status: nextStatus };
}

export async function checkInBooking(input: {
  orgId: string;
  bookingId: string;
  actorUserId?: string | null;
  siteId?: string;
}) {
  const row = await db.query.bookings.findFirst({
    where: and(eq(bookings.id, input.bookingId), eq(bookings.orgId, input.orgId)),
  });
  if (!row) throw new AppError(404, "NOT_FOUND", "Booking not found.");
  if (row.status !== "confirmed") {
    throw new AppError(422, "NOT_CONFIRMED", "Only confirmed bookings can be checked in.");
  }

  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, row.resourceId),
  });
  if (!resource) throw new AppError(404, "NOT_FOUND", "Resource not found.");
  if (input.siteId && resource.siteId !== input.siteId) {
    throw new AppError(403, "WRONG_SITE", "This kiosk cannot check in that room.");
  }

  await db
    .update(bookings)
    .set({ checkedInAt: new Date(), updatedAt: new Date() })
    .where(eq(bookings.id, row.id));

  await writeAudit({
    orgId: input.orgId,
    actorUserId: input.actorUserId,
    action: "booking.checked_in",
    entity: "booking",
    entityId: row.id,
  });

  return { ok: true };
}

export async function updateAddonFulfillment(input: {
  actor: SessionUser;
  lineId: string;
  fulfillment: "requested" | "confirmed" | "delivered";
}) {
  if (
    input.actor.role !== "facilities_admin" &&
    input.actor.role !== "org_admin" &&
    input.actor.role !== "platform_admin"
  ) {
    throw new AppError(403, "FORBIDDEN", "Facilities only.");
  }

  const line = await db.query.bookingAddons.findFirst({
    where: and(
      eq(bookingAddons.id, input.lineId),
      eq(bookingAddons.orgId, input.actor.orgId),
    ),
  });
  if (!line) throw new AppError(404, "NOT_FOUND", "Add-on line not found.");

  const order = ["requested", "confirmed", "delivered"] as const;
  if (order.indexOf(input.fulfillment) < order.indexOf(line.fulfillment as typeof order[number])) {
    throw new AppError(422, "INVALID_TRANSITION", "Fulfillment cannot move backwards.");
  }
  if (
    line.fulfillment === "requested" &&
    input.fulfillment === "delivered"
  ) {
    throw new AppError(422, "INVALID_TRANSITION", "Confirm before marking delivered.");
  }

  await db
    .update(bookingAddons)
    .set({ fulfillment: input.fulfillment, updatedAt: new Date() })
    .where(eq(bookingAddons.id, line.id));

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, line.bookingId),
  });
  const organizer = booking
    ? await db.query.users.findFirst({ where: eq(users.id, booking.organizerUserId) })
    : null;
  if (organizer) {
    await enqueueEmail({
      orgId: input.actor.orgId,
      toEmail: organizer.email,
      template: "addon.status",
      payload: { fulfillment: input.fulfillment },
    });
  }

  return { ok: true };
}

export async function expireStaleBookings() {
  const now = new Date();
  const holding = await db
    .select({ booking: bookings, resource: resources, approval: approvals })
    .from(bookings)
    .innerJoin(resources, eq(bookings.resourceId, resources.id))
    .leftJoin(approvals, eq(approvals.bookingId, bookings.id))
    .where(sql`${bookings.status} in ('confirmed','pending_approval')`);

  let released = 0;
  for (const row of holding) {
    if (
      row.booking.status === "pending_approval" &&
      row.approval &&
      row.approval.dueAt.getTime() < now.getTime()
    ) {
      await db
        .update(bookings)
        .set({ status: "expired", updatedAt: now })
        .where(eq(bookings.id, row.booking.id));
      await db
        .update(approvals)
        .set({ status: "expired", updatedAt: now })
        .where(eq(approvals.id, row.approval.id));
      released += 1;
      continue;
    }

    if (
      row.booking.status === "confirmed" &&
      row.resource.requiresCheckin &&
      !row.booking.checkedInAt
    ) {
      const graceEnd = new Date(
        row.booking.startAt.getTime() + row.resource.checkinGraceMinutes * 60_000,
      );
      if (now.getTime() > graceEnd.getTime()) {
        await db
          .update(bookings)
          .set({ status: "expired", updatedAt: now })
          .where(eq(bookings.id, row.booking.id));
        released += 1;
      }
    }
  }
  return released;
}

export async function listPendingApprovals(orgId: string) {
  return db
    .select({
      booking: bookings,
      resource: resources,
      site: sites,
      organizer: users,
      approval: approvals,
    })
    .from(bookings)
    .innerJoin(resources, eq(bookings.resourceId, resources.id))
    .innerJoin(sites, eq(resources.siteId, sites.id))
    .innerJoin(users, eq(bookings.organizerUserId, users.id))
    .innerJoin(approvals, eq(approvals.bookingId, bookings.id))
    .where(
      and(
        eq(bookings.orgId, orgId),
        eq(bookings.status, "pending_approval"),
        eq(approvals.status, "pending"),
      ),
    )
    .orderBy(bookings.startAt);
}

export async function listFulfillment(orgId: string) {
  return db
    .select({
      line: bookingAddons,
      addon: addons,
      booking: bookings,
      resource: resources,
    })
    .from(bookingAddons)
    .innerJoin(addons, eq(bookingAddons.addonId, addons.id))
    .innerJoin(bookings, eq(bookingAddons.bookingId, bookings.id))
    .innerJoin(resources, eq(bookings.resourceId, resources.id))
    .where(
      and(
        eq(bookingAddons.orgId, orgId),
        ne(bookings.status, "cancelled"),
        ne(bookings.status, "declined"),
        ne(bookings.status, "expired"),
      ),
    )
    .orderBy(bookings.startAt);
}


