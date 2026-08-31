import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
};

export const organizations = pgTable("organizations", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("active"),
  approvalCapacityThreshold: integer("approval_capacity_threshold")
    .notNull()
    .default(8),
  defaultTimezone: text("default_timezone").notNull().default("Europe/London"),
  ...timestamps,
});

export const sites = pgTable(
  "sites",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    timezone: text("timezone").notNull(),
    address: text("address"),
    kioskEnabled: boolean("kiosk_enabled").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("sites_org_idx").on(t.orgId),
    uniqueIndex("sites_org_name_idx").on(t.orgId, t.name),
  ],
);

export const resources = pgTable(
  "resources",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    siteId: text("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    capacity: integer("capacity").notNull().default(1),
    amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
    minLeadMinutes: integer("min_lead_minutes").notNull().default(0),
    maxDurationMinutes: integer("max_duration_minutes").notNull().default(480),
    cancelCutoffMinutes: integer("cancel_cutoff_minutes").notNull().default(60),
    requiresCheckin: boolean("requires_checkin").notNull().default(false),
    checkinGraceMinutes: integer("checkin_grace_minutes").notNull().default(10),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("resources_org_site_idx").on(t.orgId, t.siteId),
    index("resources_org_kind_idx").on(t.orgId, t.kind),
  ],
);

export const users = pgTable(
  "users",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("employee"),
    status: text("status").notNull().default("active"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_org_email_idx").on(t.orgId, t.email),
    index("users_org_role_idx").on(t.orgId, t.role),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: id(),
    email: text("email").notNull(),
    ip: text("ip").notNull(),
    attemptedAt: timestamp("attempted_at", { withTimezone: true })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("login_attempts_email_ip_idx").on(t.email, t.ip, t.attemptedAt)],
);

export const addons = pgTable(
  "addons",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    requiresApproval: boolean("requires_approval").notNull().default(false),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("addons_org_idx").on(t.orgId)],
);

export const bookingSeries = pgTable("booking_series", {
  id: id(),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  organizerUserId: text("organizer_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  freq: text("freq").notNull(),
  occurrenceCount: integer("occurrence_count").notNull(),
  ...timestamps,
});

export const bookings = pgTable(
  "bookings",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    organizerUserId: text("organizer_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    seriesId: text("series_id").references(() => bookingSeries.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    guests: jsonb("guests")
      .$type<{ name: string; email?: string }[]>()
      .notNull()
      .default([]),
    chargeCode: text("charge_code"),
    status: text("status").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("bookings_org_resource_idx").on(t.orgId, t.resourceId),
    index("bookings_org_organizer_idx").on(t.orgId, t.organizerUserId),
    index("bookings_org_status_idx").on(t.orgId, t.status),
    index("bookings_start_idx").on(t.startAt),
  ],
);

export const bookingAddons = pgTable(
  "booking_addons",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    addonId: text("addon_id")
      .notNull()
      .references(() => addons.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    fulfillment: text("fulfillment").notNull().default("requested"),
    ...timestamps,
  },
  (t) => [index("booking_addons_booking_idx").on(t.bookingId)],
);

export const approvals = pgTable(
  "approvals",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    decidedByUserId: text("decided_by_user_id").references(() => users.id),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    reason: text("reason"),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("approvals_booking_idx").on(t.bookingId),
    index("approvals_org_status_idx").on(t.orgId, t.status),
  ],
);

export const kioskDevices = pgTable(
  "kiosk_devices",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    siteId: text("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    pairingCodeHash: text("pairing_code_hash"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("kiosk_org_site_idx").on(t.orgId, t.siteId)],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id"),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    payload: jsonb("payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("audit_org_created_idx").on(t.orgId, t.createdAt)],
);

export const emailOutbox = pgTable(
  "email_outbox",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    toEmail: text("to_email").notNull(),
    template: text("template").notNull(),
    payload: jsonb("payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    status: text("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true })
      .notNull()
      .$defaultFn(() => new Date()),
    lastError: text("last_error"),
    ...timestamps,
  },
  (t) => [index("email_outbox_status_idx").on(t.status, t.nextAttemptAt)],
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  sites: many(sites),
  users: many(users),
  resources: many(resources),
}));

export const sitesRelations = relations(sites, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [sites.orgId],
    references: [organizations.id],
  }),
  resources: many(resources),
}));

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  site: one(sites, { fields: [resources.siteId], references: [sites.id] }),
  organization: one(organizations, {
    fields: [resources.orgId],
    references: [organizations.id],
  }),
  bookings: many(bookings),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.orgId],
    references: [organizations.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  resource: one(resources, {
    fields: [bookings.resourceId],
    references: [resources.id],
  }),
  organizer: one(users, {
    fields: [bookings.organizerUserId],
    references: [users.id],
  }),
  addons: many(bookingAddons),
  approval: one(approvals, {
    fields: [bookings.id],
    references: [approvals.bookingId],
  }),
}));

export const bookingAddonsRelations = relations(bookingAddons, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingAddons.bookingId],
    references: [bookings.id],
  }),
  addon: one(addons, {
    fields: [bookingAddons.addonId],
    references: [addons.id],
  }),
}));

export type Organization = typeof organizations.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type User = typeof users.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Addon = typeof addons.$inferSelect;
export type KioskDevice = typeof kioskDevices.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Approval = typeof approvals.$inferSelect;
export type BookingAddon = typeof bookingAddons.$inferSelect;
