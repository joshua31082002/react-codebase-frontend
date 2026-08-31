import "server-only";
import { db } from "@/db";
import { auditEvents } from "@/db/schema";

export async function writeAudit(input: {
  orgId: string;
  actorUserId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  payload?: Record<string, unknown>;
  ip?: string | null;
}) {
  await db.insert(auditEvents).values({
    orgId: input.orgId,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId ?? null,
    payload: input.payload ?? {},
    ip: input.ip ?? null,
  });
}
