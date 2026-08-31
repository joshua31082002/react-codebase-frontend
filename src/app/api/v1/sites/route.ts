import { authed, authedFacilities } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { siteSchema } from "@/lib/validators";
import { createSite, listSites } from "@/services/catalog.service";

export async function GET() {
  try {
    const user = await authed();
    const rows = await listSites(user.orgId);
    return jsonOk({ sites: rows });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authedFacilities();
    const body = siteSchema.parse(await readJson(request));
    const site = await createSite(user, body);
    return jsonOk({ site }, 201);
  } catch (error) {
    return handleError(error);
  }
}
