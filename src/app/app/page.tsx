import Link from "next/link";
import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { bookings, resources, sites } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { EmptyState, StatusPill, buttonClass } from "@/components/ui";
import { formatInTimeZone } from "@/lib/datetime";
import { BookingActions } from "@/components/actions";

export default async function TodayPage() {
  const user = await requireUser();
  const now = new Date();
  const rows = await db
    .select({
      booking: bookings,
      resource: resources,
      site: sites,
    })
    .from(bookings)
    .innerJoin(resources, eq(bookings.resourceId, resources.id))
    .innerJoin(sites, eq(resources.siteId, sites.id))
    .where(
      and(
        eq(bookings.orgId, user.orgId),
        eq(bookings.organizerUserId, user.id),
        gte(bookings.endAt, now),
      ),
    )
    .orderBy(bookings.startAt)
    .limit(8);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-[var(--ink-soft)]">Good to have you in, {user.name.split(" ")[0]}.</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl">Today at {user.orgName}</h1>
        </div>
        <Link href="/app/book" className={buttonClass}>
          Book a space
        </Link>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="Nothing on the board"
          body="Hold a room, desk, bay, or locker before the floor fills up."
        />
      ) : (
        <ul className="grid gap-3">
          {rows.map(({ booking, resource, site }) => (
            <li
              key={booking.id}
              className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{booking.title}</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {resource.name} · {site.name} ·{" "}
                  {formatInTimeZone(booking.startAt, site.timezone)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={booking.status} />
                <BookingActions
                  id={booking.id}
                  canCancel={booking.status === "confirmed" || booking.status === "pending_approval"}
                  canCheckIn={booking.status === "confirmed" && !booking.checkedInAt}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
