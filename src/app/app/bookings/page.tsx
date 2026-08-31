import { requireUser } from "@/lib/session";
import { listBookings } from "@/services/booking.service";
import { EmptyState, StatusPill } from "@/components/ui";
import { BookingActions } from "@/components/actions";
import { formatInTimeZone } from "@/lib/datetime";

export default async function BookingsPage() {
  const user = await requireUser();
  const rows = await listBookings({ actor: user, mine: true });

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-[var(--ink-soft)]">Holds you own, including pending ones.</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">My bookings</h1>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          body="When you hold a space, it will land here with its status and check-in window."
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
                  {resource.name} · {site.name}
                </p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {formatInTimeZone(booking.startAt, site.timezone)} –{" "}
                  {formatInTimeZone(booking.endAt, site.timezone)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={booking.status} />
                <BookingActions
                  id={booking.id}
                  canCancel={
                    booking.status === "confirmed" || booking.status === "pending_approval"
                  }
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
