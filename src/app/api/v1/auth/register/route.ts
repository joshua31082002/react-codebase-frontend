import { registerOrg } from "@/services/auth.service";
import { handleError, readJson, clientIp } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await readJson(request));
    await registerOrg({ ...body, ip: clientIp(request) });
    return jsonOk({ ok: true }, 201);
  } catch (error) {
    return handleError(error);
  }
}
