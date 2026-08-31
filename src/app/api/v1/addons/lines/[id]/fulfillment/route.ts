import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { authed } from "@/lib/authz";
import { fulfillmentSchema } from "@/lib/validators";
import { updateAddonFulfillment } from "@/services/booking.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authed(["facilities_admin", "org_admin"]);
    const { id } = await context.params;
    const body = fulfillmentSchema.parse(await readJson(request));
    await updateAddonFulfillment({
      actor: user,
      lineId: id,
      fulfillment: body.fulfillment,
    });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
