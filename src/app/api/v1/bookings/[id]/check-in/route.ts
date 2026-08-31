import { authed } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { checkInBooking } from "@/services/booking.service";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authed();
    const { id } = await context.params;
    await checkInBooking({
      orgId: user.orgId,
      bookingId: id,
      actorUserId: user.id,
    });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
