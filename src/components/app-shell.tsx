import Link from "next/link";
import { SignOutButton } from "@/components/actions";
import type { SessionUser } from "@/lib/session";
import { isFacilities } from "@/lib/session";

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const facilities = isFacilities(user.role);
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--copper)]">Atelier</p>
            <p className="font-[family-name:var(--font-display)] text-2xl">{user.orgName}</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/app">Today</Link>
            <Link href="/app/book">Book</Link>
            <Link href="/app/bookings">My bookings</Link>
            {facilities ? <Link href="/app/approvals">Approvals</Link> : null}
            {facilities ? <Link href="/app/fulfillment">Fulfillment</Link> : null}
            {facilities ? <Link href="/app/reports">Utilization</Link> : null}
            {facilities ? <Link href="/app/admin">Admin</Link> : null}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--ink-soft)]">{user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
