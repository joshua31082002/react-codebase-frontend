import { cn } from "@/lib/utils";

export function StatusPill({
  status,
}: {
  status: string;
}) {
  const tone: Record<string, string> = {
    confirmed: "bg-[var(--ok-soft)] text-[var(--ok)]",
    pending_approval: "bg-[var(--warn-soft)] text-[var(--warn)]",
    pending: "bg-[var(--warn-soft)] text-[var(--warn)]",
    declined: "bg-[var(--danger-soft)] text-[var(--danger)]",
    cancelled: "bg-[var(--line)] text-[var(--ink-soft)]",
    expired: "bg-[var(--line)] text-[var(--ink-soft)]",
    requested: "bg-[var(--warn-soft)] text-[var(--warn)]",
    delivered: "bg-[var(--ok-soft)] text-[var(--ok)]",
  };
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-medium capitalize tracking-wide",
        tone[status] ?? "bg-[var(--moss)] text-[var(--olive)]",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-dashed border-[var(--line-strong)] bg-[var(--paper-raised)] px-6 py-12 text-center">
      <p className="font-[family-name:var(--font-display)] text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[var(--ink-soft)]">{body}</p>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--ink-soft)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--ink-soft)]">{hint}</span> : null}
    </label>
  );
}

export const fieldClass =
  "min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper-raised)] px-3 text-[var(--ink)] transition hover:border-[var(--line-strong)]";

export const buttonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-[var(--ink)] px-5 text-sm font-medium text-[var(--paper)] transition hover:bg-[var(--copper-deep)] disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line-strong)] bg-transparent px-5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)] disabled:opacity-50";
