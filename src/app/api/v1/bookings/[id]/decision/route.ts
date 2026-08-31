import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { authed } from "@/lib/authz";
import { decisionSchema } from "@/lib/validators";
import { decideBooking } from "@/services/booking.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authed(["facilities_admin", "org_admin"]);
    const { id } = await context.params;
    const body = decisionSchema.parse(await readJson(request));
    const result = await decideBooking({
      actor: user,
      bookingId: id,
      decision: body.decision,
      reason: body.reason,
    });
    return jsonOk(result);
  } catch (error) {
    return handleError(error);
  }
}
