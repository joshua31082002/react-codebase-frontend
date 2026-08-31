import { authedFacilities } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { listPendingApprovals } from "@/services/booking.service";

export async function GET() {
  try {
    const user = await authedFacilities();
    const rows = await listPendingApprovals(user.orgId);
    return jsonOk({
      approvals: rows.map((row) => ({
        ...row.booking,
        resource: row.resource,
        site: row.site,
        organizer: {
          id: row.organizer.id,
          name: row.organizer.name,
          email: row.organizer.email,
        },
        dueAt: row.approval.dueAt,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}
