import { authed, authedFacilities } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { addonSchema } from "@/lib/validators";
import { createAddon, listAddons } from "@/services/catalog.service";
import { listFulfillment } from "@/services/booking.service";

export async function GET(request: Request) {
  try {
    const user = await authed();
    const url = new URL(request.url);
    if (url.searchParams.get("fulfillment") === "1") {
      const facilities = await authedFacilities();
      const rows = await listFulfillment(facilities.orgId);
      return jsonOk({
        lines: rows.map((row) => ({
          ...row.line,
          addon: row.addon,
          booking: row.booking,
          resource: row.resource,
        })),
      });
    }
    const rows = await listAddons(user.orgId);
    return jsonOk({ addons: rows });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authedFacilities();
    const body = addonSchema.parse(await readJson(request));
    const addon = await createAddon(user, body);
    return jsonOk({ addon }, 201);
  } catch (error) {
    return handleError(error);
  }
}
