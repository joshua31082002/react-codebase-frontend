import { NextRequest } from "next/server";
import { assertJobSecret } from "@/lib/authz";
import { handleError } from "@/lib/http";
import { jsonOk } from "@/lib/utils";
import { expireStaleBookings } from "@/services/booking.service";
import { processEmailOutbox } from "@/services/email.service";

export async function POST(request: NextRequest) {
  try {
    assertJobSecret(request);
    const released = await expireStaleBookings();
    const emailed = await processEmailOutbox();
    return jsonOk({ released, emailed });
  } catch (error) {
    return handleError(error);
  }
}
