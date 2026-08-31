import "server-only";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, resources, sites } from "@/db/schema";

export async function utilizationReport(orgId: string, from: Date, to: Date) {
  const catalog = await db
    .select({ resource: resources, site: sites })
    .from(resources)
    .innerJoin(sites, eq(resources.siteId, sites.id))
    .where(eq(resources.orgId, orgId));

  const rows = await db
    .select({
      resourceId: bookings.resourceId,
      minutes: sql<number>`coalesce(sum(extract(epoch from (${bookings.endAt} - ${bookings.startAt})) / 60), 0)`,
      count: sql<number>`count(*)::int`,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.orgId, orgId),
        eq(bookings.status, "confirmed"),
        gte(bookings.startAt, from),
        lt(bookings.startAt, to),
      ),
    )
    .groupBy(bookings.resourceId);

  const byId = new Map(rows.map((row) => [row.resourceId, row]));
  const windowMinutes = Math.max(1, (to.getTime() - from.getTime()) / 60000);

  return catalog.map(({ resource, site }) => {
    const stats = byId.get(resource.id);
    const bookedMinutes = Number(stats?.minutes ?? 0);
    return {
      resourceId: resource.id,
      name: resource.name,
      kind: resource.kind,
      siteName: site.name,
      bookingCount: Number(stats?.count ?? 0),
      bookedMinutes,
      utilizationPct: Math.min(100, Math.round((bookedMinutes / windowMinutes) * 1000) / 10),
    };
  });
}
