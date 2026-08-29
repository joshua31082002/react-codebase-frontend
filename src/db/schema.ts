import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull(),
});

export const creditAccounts = sqliteTable("credit_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["revolving", "installment"] }).notNull(),
  balanceCents: integer("balance_cents").notNull(),
  limitCents: integer("limit_cents"),
  openedOn: text("opened_on").notNull(),
  paymentStatus: text("payment_status", {
    enum: ["on_time", "late"],
  }).notNull(),
  latePayments: integer("late_payments").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type CreditAccount = typeof creditAccounts.$inferSelect;
