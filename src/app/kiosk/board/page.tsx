import { redirect } from "next/navigation";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { bookings, resources, users } from "@/db/schema";
import { getKioskSession } from "@/services/kiosk.service";
import { formatInTimeZone } from "@/lib/datetime";
import { StatusPill, EmptyState } from "@/components/ui";
import { KioskCheckIn } from "@/components/kiosk-checkin";

export default async function KioskBoardPage() {
  const kiosk = await getKioskSession();
  if (!kiosk) redirect("/kiosk");

  const now = new Date();
  const from = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const to = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  const rows = await db
    .select({
      booking: bookings,
      resource: resources,
      organizer: users,
    })
    .from(bookings)
    .innerJoin(resources, eq(bookings.resourceId, resources.id))
    .innerJoin(users, eq(bookings.organizerUserId, users.id))
    .where(
      and(
        eq(bookings.orgId, kiosk.orgId),
        eq(resources.siteId, kiosk.siteId),
        eq(bookings.status, "confirmed"),
        gte(bookings.endAt, from),
        lte(bookings.startAt, to),
      ),
    )
    .orderBy(bookings.startAt);

  return (
    <main className="min-h-screen bg-[var(--ink)] px-6 py-8 text-[var(--paper)]">
      <p className="text-xs uppercase tracking-[0.28em] text-[#e0b08a]">Atelier kiosk</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl">{kiosk.siteName}</h1>
      <p className="mt-2 text-[#d9d0c3]">{kiosk.name}</p>
      {rows.length === 0 ? (
        <div className="mt-16">
          <EmptyState
            title="Quiet floor"
            body="No confirmed holds in the next twelve hours."
          />
        </div>
      ) : (
        <ul className="mt-10 grid gap-4">
          {rows.map(({ booking, resource, organizer }) => (
            <li
              key={booking.id}
              className="flex flex-col gap-4 rounded-[20px] border border-[#3f3a32] bg-[#2a261f] p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl">
                  {resource.name}
                </p>
                <p className="mt-1 text-[#d9d0c3]">
                  {booking.title} · {organizer.name}
                </p>
                <p className="text-[#d9d0c3]">
                  {formatInTimeZone(booking.startAt, "Europe/London")} –{" "}
                  {formatInTimeZone(booking.endAt, "Europe/London")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={booking.checkedInAt ? "delivered" : "confirmed"} />
                {!booking.checkedInAt ? <KioskCheckIn bookingId={booking.id} /> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
