import { authed } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";

export async function GET() {
  try {
    const user = await authed();
    return jsonOk({ user });
  } catch (error) {
    return handleError(error);
  }
}
