import { authed } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { createBookingSchema } from "@/lib/validators";
import { createBooking, listBookings } from "@/services/booking.service";

export async function GET(request: Request) {
  try {
    const user = await authed();
    const url = new URL(request.url);
    const rows = await listBookings({
      actor: user,
      mine: url.searchParams.get("mine") === "1",
      status: url.searchParams.get("status") ?? undefined,
    });
    return jsonOk({
      bookings: rows.map((row) => ({
        ...row.booking,
        resource: row.resource,
        site: row.site,
        organizer: {
          id: row.organizer.id,
          name: row.organizer.name,
          email: row.organizer.email,
        },
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authed();
    const body = createBookingSchema.parse(await readJson(request));
    const created = await createBooking({
      actor: user,
      resourceId: body.resourceId,
      title: body.title,
      start: body.start,
      end: body.end,
      guests: body.guests,
      chargeCode: body.chargeCode,
      addonLines: body.addonLines,
      recurrence: body.recurrence,
    });
    return jsonOk({ bookings: created }, 201);
  } catch (error) {
    return handleError(error);
  }
}
