export function GET() {
  return Response.json({
    status: "ok",
    service: "health-next-app",
  });
}
