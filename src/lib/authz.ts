import { NextRequest } from "next/server";
import { JOB_SECRET_HEADER } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { requireFacilities, requireOrgAdmin, requireUser, type SessionUser } from "@/lib/session";

export async function authed(): Promise<SessionUser> {
  return requireUser();
}

export async function authedFacilities(): Promise<SessionUser> {
  const user = await requireUser();
  requireFacilities(user);
  return user;
}

export async function authedAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  requireOrgAdmin(user);
  return user;
}

export function assertJobSecret(request: NextRequest) {
  const expected = process.env.JOB_SECRET;
  if (!expected) {
    throw new AppError(500, "JOB_SECRET_MISSING", "Job secret is not configured.");
  }
  if (request.headers.get(JOB_SECRET_HEADER) !== expected) {
    throw new AppError(401, "UNAUTHENTICATED", "Invalid job secret.");
  }
}
