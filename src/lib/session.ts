import "server-only";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, organizations } from "@/db/schema";
import { hashToken } from "@/lib/crypto";
import { SESSION_COOKIE } from "@/lib/constants";
import type { UserRole } from "@/lib/constants";
import { AppError } from "@/lib/errors";

export type SessionUser = {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: UserRole;
  orgName: string;
  orgSlug: string;
  approvalCapacityThreshold: number;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = hashToken(token);
  const rows = await db
    .select({
      user: users,
      org: organizations,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .innerJoin(organizations, eq(users.orgId, organizations.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row || row.user.status !== "active") return null;
  return {
    id: row.user.id,
    orgId: row.user.orgId,
    email: row.user.email,
    name: row.user.name,
    role: row.user.role as UserRole,
    orgName: row.org.name,
    orgSlug: row.org.slug,
    approvalCapacityThreshold: row.org.approvalCapacityThreshold,
  };
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new AppError(401, "UNAUTHENTICATED", "Sign in required.");
  }
  return user;
}

export function requireRole(user: SessionUser, roles: UserRole[]) {
  if (user.role === "platform_admin") return;
  if (!roles.includes(user.role)) {
    throw new AppError(403, "FORBIDDEN", "You do not have access to this action.");
  }
}

export function isFacilities(role: UserRole) {
  return role === "facilities_admin" || role === "org_admin" || role === "platform_admin";
}

export function isOrgAdmin(role: UserRole) {
  return role === "org_admin" || role === "platform_admin";
}

export function requireFacilities(user: SessionUser) {
  if (!isFacilities(user.role)) {
    throw new AppError(403, "FORBIDDEN", "Facilities access required.");
  }
}

export function requireOrgAdmin(user: SessionUser) {
  if (!isOrgAdmin(user.role)) {
    throw new AppError(403, "FORBIDDEN", "Administrator access required.");
  }
}
