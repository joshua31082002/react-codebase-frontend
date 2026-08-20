const healthEndpoint = "/api/health";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/20 sm:p-12">
        <div className="mb-12 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Next.js service
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Operational
          </span>
        </div>

        <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          A clean starting point for your application.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
          This App Router application is running and exposes a lightweight
          health check for monitoring and deployment verification.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Health endpoint
          </p>
          <a
            className="mt-3 inline-block font-mono text-lg text-cyan-300 underline decoration-cyan-300/30 underline-offset-4 transition hover:text-cyan-200"
            href={healthEndpoint}
          >
            GET {healthEndpoint}
          </a>
          <p className="mt-3 text-sm text-slate-500">
            Returns a JSON response with <code>status: &quot;ok&quot;</code>.
          </p>
        </div>
      </section>
    </main>
  );
}
