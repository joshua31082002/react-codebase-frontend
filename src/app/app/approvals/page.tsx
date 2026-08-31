import { redirect } from "next/navigation";
import { requireUser, isFacilities } from "@/lib/session";
import { listPendingApprovals } from "@/services/booking.service";
import { EmptyState, StatusPill } from "@/components/ui";
import { BookingActions } from "@/components/actions";
import { formatInTimeZone } from "@/lib/datetime";

export default async function ApprovalsPage() {
  const user = await requireUser();
  if (!isFacilities(user.role)) redirect("/app");
  const rows = await listPendingApprovals(user.orgId);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Approvals</h1>
        <p className="text-[var(--ink-soft)]">
          Policy holds expire after 24 hours if no one decides.
        </p>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          body="Large rooms, recurring series, and approval add-ons land here."
        />
      ) : (
        <ul className="grid gap-3">
          {rows.map(({ booking, resource, site, organizer, approval }) => (
            <li
              key={booking.id}
              className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{booking.title}</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {resource.name} · {site.name} · {organizer.name}
                </p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {formatInTimeZone(booking.startAt, site.timezone)} · due{" "}
                  {formatInTimeZone(approval.dueAt, site.timezone)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={booking.status} />
                <BookingActions id={booking.id} canDecide />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
