import { authedFacilities } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { decisionSchema } from "@/lib/validators";
import { decideBooking, listPendingApprovals } from "@/services/booking.service";

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

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await authedFacilities();
    const { id } = await context.params;
    const body = decisionSchema.parse(await readJson(request));
    const result = await decideBooking({
      actor: user,
      bookingId: id,
      decision: body.decision,
      reason: body.reason,
    });
    return jsonOk(result);
  } catch (error) {
    return handleError(error);
  }
}
