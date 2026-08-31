import { authedFacilities } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { pairStartSchema } from "@/lib/validators";
import { listKiosks, startPairing } from "@/services/kiosk.service";

export async function GET() {
  try {
    const user = await authedFacilities();
    const rows = await listKiosks(user.orgId);
    return jsonOk({
      kiosks: rows.map((row) => ({
        ...row.device,
        siteName: row.site.name,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authedFacilities();
    const body = pairStartSchema.parse(await readJson(request));
    const result = await startPairing(user, body.siteId, body.name);
    return jsonOk(result, 201);
  } catch (error) {
    return handleError(error);
  }
}
