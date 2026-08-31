import { authedAdmin, authedFacilities } from "@/lib/authz";
import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { inviteUser, listPeople } from "@/services/catalog.service";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(2).max(80),
  role: z.enum(["employee", "facilities_admin", "org_admin"]),
  password: z.string().min(10).max(200),
});

export async function GET() {
  try {
    const user = await authedFacilities();
    const people = await listPeople(user.orgId);
    return jsonOk({ people });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authedAdmin();
    const body = inviteSchema.parse(await readJson(request));
    const created = await inviteUser(user, body);
    return jsonOk({ user: created }, 201);
  } catch (error) {
    return handleError(error);
  }
}
