import { login } from "@/services/auth.service";
import { handleError, readJson, clientIp } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await readJson(request));
    await login(body.email, body.password, clientIp(request));
    return jsonOk({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
