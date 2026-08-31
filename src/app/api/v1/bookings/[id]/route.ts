import { authed } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { cancelBooking, checkInBooking } from "@/services/booking.service";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authed();
    const { id } = await context.params;
    await cancelBooking({ actor: user, bookingId: id });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authed();
    const { id } = await context.params;
    const url = new URL(request.url);
    if (!url.pathname.endsWith("/check-in") && url.searchParams.get("action") !== "check-in") {
      await checkInBooking({ orgId: user.orgId, bookingId: id, actorUserId: user.id });
      return jsonOk({ ok: true });
    }
    await checkInBooking({ orgId: user.orgId, bookingId: id, actorUserId: user.id });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
