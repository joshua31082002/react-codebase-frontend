export default function Home() {
  return (
    <main className="shell">
      <p className="eyebrow">Next.js application</p>
      <h1>Service is ready.</h1>
      <p className="lede">
        Check <code>/api/health</code> for a machine-readable health response.
      </p>
      <a className="button" href="/api/health">
        View health status
      </a>
    </main>
  );
}
