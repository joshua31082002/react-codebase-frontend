import { logout } from "@/services/auth.service";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";

export async function POST() {
  try {
    await logout();
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
