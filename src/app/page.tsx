import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { buttonClass, ghostButtonClass } from "@/components/ui";

export default async function HomePage() {
  const user = await getSessionUser();
  if (user) redirect("/app");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ead7c8,transparent_40%),radial-gradient(circle_at_bottom_right,#dce6d4,transparent_35%)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--copper)]">Atelier</p>
        <div className="flex gap-3">
          <Link href="/login" className={ghostButtonClass}>
            Sign in
          </Link>
          <Link href="/register" className={buttonClass}>
            Open a workplace
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--olive-soft)]">
            Workplace booking
          </p>
          <h1 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] md:text-6xl">
            Hold the room before the day gets away from you.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-[var(--ink-soft)]">
            Employees reserve rooms, desks, parking, and lockers against live availability.
            Facilities keep policy, approvals, and kiosk check-in in one quiet system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className={buttonClass}>
              Sign in to Northline
            </Link>
            <Link href="/kiosk" className={ghostButtonClass}>
              Pair a kiosk
            </Link>
          </div>
        </div>
        <aside className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-raised)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm text-[var(--ink-soft)]">Demo workplace</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
            Farringdon House
          </p>
          <ul className="mt-6 grid gap-3 text-sm">
            <li className="flex justify-between border-b border-[var(--line)] pb-3">
              <span>Boardroom Alder</span>
              <span>12 seats · check-in</span>
            </li>
            <li className="flex justify-between border-b border-[var(--line)] pb-3">
              <span>Huddle Birch</span>
              <span>instant hold</span>
            </li>
            <li className="flex justify-between border-b border-[var(--line)] pb-3">
              <span>Hot desk 14</span>
              <span>monitor + dock</span>
            </li>
            <li className="flex justify-between">
              <span>Bay P-07</span>
              <span>EV</span>
            </li>
          </ul>
          <p className="mt-6 text-xs text-[var(--ink-soft)]">
            Priya Shah · priya.shah@northline.example · atelier-demo-1
          </p>
        </aside>
      </main>
    </div>
  );
}
