import { z } from "zod";

export const registerSchema = z.object({
  orgName: z.string().trim().min(2).max(80),
  adminName: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(10).max(200),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});

export const availabilitySchema = z.object({
  siteId: z.string().optional(),
  kind: z.enum(["room", "desk", "parking", "locker"]).optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  capacity: z.coerce.number().int().positive().optional(),
});

export const createBookingSchema = z.object({
  resourceId: z.string().min(1),
  title: z.string().trim().min(2).max(120),
  start: z.coerce.date(),
  end: z.coerce.date(),
  guests: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),
        email: z.email().optional(),
      }),
    )
    .max(50)
    .optional(),
  chargeCode: z.string().trim().max(40).optional(),
  addonLines: z
    .array(
      z.object({
        addonId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .max(20)
    .optional(),
  recurrence: z
    .object({
      freq: z.enum(["daily", "weekly"]),
      count: z.number().int().min(2).max(13),
    })
    .optional(),
});

export const decisionSchema = z.object({
  decision: z.enum(["approved", "declined"]),
  reason: z.string().trim().max(400).optional(),
});

export const fulfillmentSchema = z.object({
  fulfillment: z.enum(["requested", "confirmed", "delivered"]),
});

export const siteSchema = z.object({
  name: z.string().trim().min(2).max(80),
  timezone: z.string().min(1).max(80),
  address: z.string().trim().max(200).optional(),
});

export const resourceSchema = z.object({
  siteId: z.string().min(1),
  kind: z.enum(["room", "desk", "parking", "locker"]),
  name: z.string().trim().min(2).max(80),
  capacity: z.number().int().min(1).max(500),
  amenities: z.array(z.string().max(40)).max(20).optional(),
  minLeadMinutes: z.number().int().min(0).max(10080).optional(),
  maxDurationMinutes: z.number().int().min(15).max(1440).optional(),
  cancelCutoffMinutes: z.number().int().min(0).max(1440).optional(),
  requiresCheckin: z.boolean().optional(),
  checkinGraceMinutes: z.number().int().min(0).max(120).optional(),
});

export const addonSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).optional(),
  requiresApproval: z.boolean().optional(),
});

export const pairStartSchema = z.object({
  siteId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
});

export const pairCompleteSchema = z.object({
  pairingCode: z.string().trim().min(4).max(16),
});
