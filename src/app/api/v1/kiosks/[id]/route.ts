import { authedFacilities } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { revokeKiosk } from "@/services/kiosk.service";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authedFacilities();
    const { id } = await context.params;
    await revokeKiosk(user, id);
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
