import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return Response.json(
    { error: { code, message, details } },
    { status },
  );
}

export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
