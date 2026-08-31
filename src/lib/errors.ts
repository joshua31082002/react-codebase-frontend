export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isOverlapError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const record = error as { code?: string; constraint_name?: string; message?: string };
  return (
    record.code === "23P01" ||
    record.constraint_name === "bookings_no_overlap" ||
    (typeof record.message === "string" &&
      record.message.includes("bookings_no_overlap"))
  );
}
