import { authedFacilities } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { utilizationReport } from "@/services/report.service";

export async function GET(request: Request) {
  try {
    const user = await authedFacilities();
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const start = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = to ? new Date(to) : new Date();
    const rows = await utilizationReport(user.orgId, start, end);
    return jsonOk({ from: start, to: end, resources: rows });
  } catch (error) {
    return handleError(error);
  }
}
