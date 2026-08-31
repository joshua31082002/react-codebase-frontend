import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { addons, auditEvents, resources, sites, users } from "@/db/schema";
import { AppError } from "@/lib/errors";
import { RESOURCE_KINDS } from "@/lib/constants";
import { writeAudit } from "@/services/audit.service";
import type { SessionUser } from "@/lib/session";
import { requireFacilities, requireOrgAdmin } from "@/lib/session";

export async function listSites(orgId: string) {
  return db.select().from(sites).where(eq(sites.orgId, orgId));
}

export async function createSite(
  actor: SessionUser,
  input: { name: string; timezone: string; address?: string },
) {
  requireFacilities(actor);
  const [site] = await db
    .insert(sites)
    .values({
      orgId: actor.orgId,
      name: input.name.trim(),
      timezone: input.timezone.trim(),
      address: input.address?.trim() || null,
    })
    .returning();
  await writeAudit({
    orgId: actor.orgId,
    actorUserId: actor.id,
    action: "site.created",
    entity: "site",
    entityId: site.id,
  });
  return site;
}

export async function listResources(orgId: string) {
  return db
    .select({ resource: resources, site: sites })
    .from(resources)
    .innerJoin(sites, eq(resources.siteId, sites.id))
    .where(eq(resources.orgId, orgId));
}

export async function createResource(
  actor: SessionUser,
  input: {
    siteId: string;
    kind: string;
    name: string;
    capacity: number;
    amenities?: string[];
    minLeadMinutes?: number;
    maxDurationMinutes?: number;
    cancelCutoffMinutes?: number;
    requiresCheckin?: boolean;
    checkinGraceMinutes?: number;
  },
) {
  requireFacilities(actor);
  if (!RESOURCE_KINDS.includes(input.kind as (typeof RESOURCE_KINDS)[number])) {
    throw new AppError(422, "INVALID_KIND", "Unknown resource kind.");
  }
  const site = await db.query.sites.findFirst({
    where: and(eq(sites.id, input.siteId), eq(sites.orgId, actor.orgId)),
  });
  if (!site) throw new AppError(404, "NOT_FOUND", "Site not found.");
  const [resource] = await db
    .insert(resources)
    .values({
      orgId: actor.orgId,
      siteId: site.id,
      kind: input.kind,
      name: input.name.trim(),
      capacity: input.capacity,
      amenities: input.amenities ?? [],
      minLeadMinutes: input.minLeadMinutes ?? 0,
      maxDurationMinutes: input.maxDurationMinutes ?? 480,
      cancelCutoffMinutes: input.cancelCutoffMinutes ?? 60,
      requiresCheckin: input.requiresCheckin ?? input.kind === "room",
      checkinGraceMinutes: input.checkinGraceMinutes ?? 10,
    })
    .returning();
  await writeAudit({
    orgId: actor.orgId,
    actorUserId: actor.id,
    action: "resource.created",
    entity: "resource",
    entityId: resource.id,
  });
  return resource;
}

export async function listAddons(orgId: string) {
  return db.select().from(addons).where(eq(addons.orgId, orgId));
}

export async function createAddon(
  actor: SessionUser,
  input: { name: string; description?: string; requiresApproval?: boolean },
) {
  requireFacilities(actor);
  const [addon] = await db
    .insert(addons)
    .values({
      orgId: actor.orgId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      requiresApproval: input.requiresApproval ?? false,
    })
    .returning();
  await writeAudit({
    orgId: actor.orgId,
    actorUserId: actor.id,
    action: "addon.created",
    entity: "addon",
    entityId: addon.id,
  });
  return addon;
}

export async function inviteUser(
  actor: SessionUser,
  input: { email: string; name: string; role: "employee" | "facilities_admin" | "org_admin"; password: string },
) {
  requireOrgAdmin(actor);
  const { hashPassword } = await import("@/lib/crypto");
  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({
      orgId: actor.orgId,
      email: input.email.toLowerCase().trim(),
      name: input.name.trim(),
      passwordHash,
      role: input.role,
    })
    .returning();
  await writeAudit({
    orgId: actor.orgId,
    actorUserId: actor.id,
    action: "user.invited",
    entity: "user",
    entityId: user.id,
  });
  return { id: user.id, email: user.email, role: user.role };
}

export async function listPeople(orgId: string) {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(users.orgId, orgId));
}

export async function listAudit(orgId: string) {
  return db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.orgId, orgId))
    .orderBy(desc(auditEvents.createdAt))
    .limit(100);
}
