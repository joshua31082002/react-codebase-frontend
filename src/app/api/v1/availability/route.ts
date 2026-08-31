import { authed } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { availabilitySchema } from "@/lib/validators";
import { searchAvailability } from "@/services/booking.service";

export async function GET(request: Request) {
  try {
    const user = await authed();
    const url = new URL(request.url);
    const query = availabilitySchema.parse({
      siteId: url.searchParams.get("siteId") ?? undefined,
      kind: url.searchParams.get("kind") ?? undefined,
      start: url.searchParams.get("start"),
      end: url.searchParams.get("end"),
      capacity: url.searchParams.get("capacity") ?? undefined,
    });
    const resources = await searchAvailability({
      orgId: user.orgId,
      siteId: query.siteId,
      kind: query.kind,
      start: query.start,
      end: query.end,
      capacity: query.capacity,
    });
    return jsonOk({ resources });
  } catch (error) {
    return handleError(error);
  }
}
