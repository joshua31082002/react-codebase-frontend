import "server-only";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { emailOutbox } from "@/db/schema";

export async function enqueueEmail(input: {
  orgId: string;
  toEmail: string;
  template: string;
  payload: Record<string, unknown>;
}) {
  await db.insert(emailOutbox).values({
    orgId: input.orgId,
    toEmail: input.toEmail,
    template: input.template,
    payload: input.payload,
    status: "pending",
  });
}

export async function processEmailOutbox(limit = 25) {
  const pending = await db
    .select()
    .from(emailOutbox)
    .where(
      and(eq(emailOutbox.status, "pending"), lte(emailOutbox.nextAttemptAt, new Date())),
    )
    .limit(limit);

  for (const row of pending) {
    try {
      if (process.env.EMAIL_PROVIDER !== "stub") {
        console.info(`[email] ${row.template} -> ${row.toEmail}`);
      }
      await db
        .update(emailOutbox)
        .set({ status: "sent", attempts: row.attempts + 1, lastError: null })
        .where(eq(emailOutbox.id, row.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "send_failed";
      await db
        .update(emailOutbox)
        .set({
          status: "pending",
          attempts: row.attempts + 1,
          lastError: message,
          nextAttemptAt: new Date(Date.now() + 5 * 60_000),
        })
        .where(eq(emailOutbox.id, row.id));
    }
  }

  return pending.length;
}
