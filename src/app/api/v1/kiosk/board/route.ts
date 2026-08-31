import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { requireKiosk } from "@/services/kiosk.service";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { bookings, resources, users } from "@/db/schema";
import { checkInBooking } from "@/services/booking.service";
import { readJson } from "@/lib/http";
import { z } from "zod";

export async function GET() {
  try {
    const kiosk = await requireKiosk();
    const now = new Date();
    const from = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const to = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const rows = await db
      .select({
        booking: bookings,
        resource: resources,
        organizer: users,
      })
      .from(bookings)
      .innerJoin(resources, eq(bookings.resourceId, resources.id))
      .innerJoin(users, eq(bookings.organizerUserId, users.id))
      .where(
        and(
          eq(bookings.orgId, kiosk.orgId),
          eq(resources.siteId, kiosk.siteId),
          eq(bookings.status, "confirmed"),
          gte(bookings.endAt, from),
          lte(bookings.startAt, to),
        ),
      )
      .orderBy(bookings.startAt);
    return jsonOk({
      kiosk,
      bookings: rows.map((row) => ({
        ...row.booking,
        resource: row.resource,
        organizer: { name: row.organizer.name },
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const kiosk = await requireKiosk();
    const body = z.object({ bookingId: z.string().min(1) }).parse(await readJson(request));
    await checkInBooking({
      orgId: kiosk.orgId,
      bookingId: body.bookingId,
      siteId: kiosk.siteId,
    });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
