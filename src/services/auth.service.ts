import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { loginAttempts, organizations, sessions, users } from "@/db/schema";
import { hashPassword, hashToken, newToken, verifyPassword } from "@/lib/crypto";
import {
  LOGIN_MAX_ATTEMPTS,
  LOGIN_WINDOW_MS,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import { writeAudit } from "@/services/audit.service";

const GENERIC_LOGIN = "Invalid credentials";

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function registerOrg(input: {
  orgName: string;
  adminName: string;
  email: string;
  password: string;
  ip?: string;
}) {
  if (input.password.length < 10) {
    throw new AppError(422, "WEAK_PASSWORD", "Use at least 10 characters.");
  }

  const email = input.email.toLowerCase().trim();
  const slug = `${slugify(input.orgName) || "org"}-${newToken(3)}`;
  const passwordHash = await hashPassword(input.password);

  const created = await db.transaction(async (tx) => {
    const [org] = await tx
      .insert(organizations)
      .values({
        name: input.orgName.trim(),
        slug,
      })
      .returning();
    const [admin] = await tx
      .insert(users)
      .values({
        orgId: org.id,
        email,
        name: input.adminName.trim(),
        passwordHash,
        role: "org_admin",
      })
      .returning();
    return { org, admin };
  });

  await writeAudit({
    orgId: created.org.id,
    actorUserId: created.admin.id,
    action: "org.register",
    entity: "organization",
    entityId: created.org.id,
    ip: input.ip,
  });

  return createSession(created.admin.id, created.org.id);
}

export async function login(emailRaw: string, password: string, ip: string) {
  const email = emailRaw.toLowerCase().trim();
  const windowStart = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.ip, ip),
        gte(loginAttempts.attemptedAt, windowStart),
      ),
    );

  if (Number(count) >= LOGIN_MAX_ATTEMPTS) {
    throw new AppError(429, "RATE_LIMITED", "Too many attempts. Try again later.");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;

  await db.insert(loginAttempts).values({ email, ip });

  if (!user || !ok || user.status !== "active") {
    throw new AppError(401, "INVALID_CREDENTIALS", GENERIC_LOGIN);
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await writeAudit({
    orgId: user.orgId,
    actorUserId: user.id,
    action: "auth.login",
    entity: "user",
    entityId: user.id,
    ip,
  });

  return createSession(user.id, user.orgId);
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  jar.set(SESSION_COOKIE, "", cookieOptions(new Date(0)));
}

async function createSession(userId: string, orgId: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({
    userId,
    orgId,
    tokenHash: hashToken(token),
    expiresAt,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, cookieOptions(expiresAt));
  return { ok: true as const };
}
