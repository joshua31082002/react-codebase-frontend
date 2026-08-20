export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Next.js application
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-950">
          Service is running
        </h1>
        <p className="mb-8 text-lg leading-8 text-slate-600">
          Use the health endpoint to check application availability.
        </p>
        <code className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-800">
          GET /api/health
        </code>
      </section>
    </main>
  )
}
