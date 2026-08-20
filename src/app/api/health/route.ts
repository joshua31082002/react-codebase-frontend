export function GET() {
  return Response.json({
    status: "ok",
    service: "nextjs-health-app",
    timestamp: new Date().toISOString(),
  });
}
