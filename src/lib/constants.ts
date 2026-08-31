export const SESSION_COOKIE = "atelier_session";
export const KIOSK_COOKIE = "atelier_kiosk";
export const JOB_SECRET_HEADER = "x-atelier-job-secret";
export const PAGE_SIZE = 50;
export const DEFAULT_APPROVAL_THRESHOLD = 8;
export const MAX_RECURRENCE_OCCURRENCES = 13;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_MAX_ATTEMPTS = 5;
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const APPROVAL_TIMEOUT_MS = 24 * 60 * 60 * 1000;

export const RESOURCE_KINDS = ["room", "desk", "parking", "locker"] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export const USER_ROLES = [
  "employee",
  "facilities_admin",
  "org_admin",
  "platform_admin",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const BOOKING_STATUSES = [
  "confirmed",
  "pending_approval",
  "declined",
  "cancelled",
  "expired",
  "no_show",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const HOLDING_STATUSES = ["confirmed", "pending_approval"] as const;

export const ADDON_FULFILLMENT = [
  "requested",
  "confirmed",
  "delivered",
] as const;
