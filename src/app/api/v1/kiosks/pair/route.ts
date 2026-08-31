import { handleError, readJson } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { pairCompleteSchema } from "@/lib/validators";
import { completePairing } from "@/services/kiosk.service";

export async function POST(request: Request) {
  try {
    const body = pairCompleteSchema.parse(await readJson(request));
    const result = await completePairing(body.pairingCode);
    return jsonOk(result);
  } catch (error) {
    return handleError(error);
  }
}
