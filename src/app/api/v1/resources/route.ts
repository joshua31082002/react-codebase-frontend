import { authed, authedFacilities } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { resourceSchema } from "@/lib/validators";
import { createResource, listResources } from "@/services/catalog.service";

export async function GET() {
  try {
    const user = await authed();
    const rows = await listResources(user.orgId);
    return jsonOk({
      resources: rows.map((row) => ({
        ...row.resource,
        siteName: row.site.name,
        timezone: row.site.timezone,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authedFacilities();
    const body = resourceSchema.parse(await readJson(request));
    const resource = await createResource(user, body);
    return jsonOk({ resource }, 201);
  } catch (error) {
    return handleError(error);
  }
}
