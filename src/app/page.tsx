export default function Home() {
  return (
    <main className="page-shell">
      <section className="card" aria-labelledby="page-title">
        <p className="eyebrow">Next.js service</p>
        <h1 id="page-title">Health endpoint ready.</h1>
        <p className="description">
          The application is running and exposes a lightweight status check for
          uptime monitors and deployment probes.
        </p>
        <a className="endpoint" href="/api/health">
          <span>GET</span> /api/health
        </a>
      </section>
    </main>
  );
}
