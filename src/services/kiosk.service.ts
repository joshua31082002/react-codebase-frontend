import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { kioskDevices, sites } from "@/db/schema";
import { KIOSK_COOKIE } from "@/lib/constants";
import { hashToken, newToken } from "@/lib/crypto";
import { AppError } from "@/lib/errors";
import { writeAudit } from "@/services/audit.service";
import type { SessionUser } from "@/lib/session";
import { requireFacilities } from "@/lib/session";

export type KioskSession = {
  id: string;
  orgId: string;
  siteId: string;
  name: string;
  siteName: string;
};

function cookieOptions(expires?: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function startPairing(actor: SessionUser, siteId: string, name: string) {
  requireFacilities(actor);
  const site = await db.query.sites.findFirst({
    where: and(eq(sites.id, siteId), eq(sites.orgId, actor.orgId)),
  });
  if (!site || !site.kioskEnabled) {
    throw new AppError(404, "NOT_FOUND", "Site not found or kiosk disabled.");
  }

  const pairingCode = newToken(6).slice(0, 8).toUpperCase();
  const [device] = await db
    .insert(kioskDevices)
    .values({
      orgId: actor.orgId,
      siteId,
      name: name.trim(),
      tokenHash: hashToken(newToken()),
      pairingCodeHash: hashToken(pairingCode),
    })
    .returning();

  await writeAudit({
    orgId: actor.orgId,
    actorUserId: actor.id,
    action: "kiosk.pairing_started",
    entity: "kiosk",
    entityId: device.id,
  });

  return { deviceId: device.id, pairingCode };
}

export async function completePairing(pairingCode: string) {
  const codeHash = hashToken(pairingCode.trim().toUpperCase());
  const device = await db.query.kioskDevices.findFirst({
    where: and(eq(kioskDevices.pairingCodeHash, codeHash), isNull(kioskDevices.revokedAt)),
  });
  if (!device) {
    throw new AppError(401, "INVALID_CODE", "That pairing code is not valid.");
  }

  const token = newToken();
  await db
    .update(kioskDevices)
    .set({
      tokenHash: hashToken(token),
      pairingCodeHash: null,
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(kioskDevices.id, device.id));

  const jar = await cookies();
  jar.set(KIOSK_COOKIE, token, cookieOptions(new Date(Date.now() + 400 * 24 * 60 * 60 * 1000)));
  return { ok: true, siteId: device.siteId };
}

export async function getKioskSession(): Promise<KioskSession | null> {
  const jar = await cookies();
  const token = jar.get(KIOSK_COOKIE)?.value;
  if (!token) return null;
  const device = await db.query.kioskDevices.findFirst({
    where: and(eq(kioskDevices.tokenHash, hashToken(token)), isNull(kioskDevices.revokedAt)),
  });
  if (!device) return null;
  const site = await db.query.sites.findFirst({
    where: eq(sites.id, device.siteId),
  });
  if (!site) return null;
  await db
    .update(kioskDevices)
    .set({ lastSeenAt: new Date() })
    .where(eq(kioskDevices.id, device.id));
  return {
    id: device.id,
    orgId: device.orgId,
    siteId: device.siteId,
    name: device.name,
    siteName: site.name,
  };
}

export async function requireKiosk() {
  const kiosk = await getKioskSession();
  if (!kiosk) {
    throw new AppError(401, "UNAUTHENTICATED", "This kiosk is not paired.");
  }
  return kiosk;
}

export async function revokeKiosk(actor: SessionUser, deviceId: string) {
  requireFacilities(actor);
  const device = await db.query.kioskDevices.findFirst({
    where: and(eq(kioskDevices.id, deviceId), eq(kioskDevices.orgId, actor.orgId)),
  });
  if (!device) throw new AppError(404, "NOT_FOUND", "Kiosk not found.");
  await db
    .update(kioskDevices)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(kioskDevices.id, device.id));
  await writeAudit({
    orgId: actor.orgId,
    actorUserId: actor.id,
    action: "kiosk.revoked",
    entity: "kiosk",
    entityId: device.id,
  });
  return { ok: true };
}

export async function listKiosks(orgId: string) {
  return db
    .select({ device: kioskDevices, site: sites })
    .from(kioskDevices)
    .innerJoin(sites, eq(kioskDevices.siteId, sites.id))
    .where(eq(kioskDevices.orgId, orgId));
}
