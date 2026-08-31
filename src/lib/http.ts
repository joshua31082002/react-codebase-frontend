import { ZodError } from "zod";
import { AppError } from "@/lib/errors";
import { jsonError } from "@/lib/utils";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return jsonError(error.status, error.code, error.message, error.details);
  }
  if (error instanceof ZodError) {
    return jsonError(422, "VALIDATION", "Check the highlighted fields.", error.issues);
  }
  console.error(error);
  return jsonError(500, "INTERNAL", "Something went wrong.");
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AppError(400, "INVALID_JSON", "Request body must be JSON.");
  }
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
}
