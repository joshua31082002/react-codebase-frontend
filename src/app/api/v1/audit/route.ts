import { authedFacilities } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { listAudit } from "@/services/catalog.service";

export async function GET() {
  try {
    const user = await authedFacilities();
    const events = await listAudit(user.orgId);
    return jsonOk({ events });
  } catch (error) {
    return handleError(error);
  }
}
