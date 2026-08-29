export default function Loading() {
  return (
    <main
      className="shell"
      aria-busy="true"
      aria-label="Loading credit health plan"
    >
      <div className="topbar">
        <span className="brand">
          Credit<span>Health</span>
        </span>
      </div>
      <section className="loading-hero">
        <span className="loading-line wide" />
        <span className="loading-line medium" />
      </section>
      <section className="loading-grid">
        <span />
        <span />
        <span />
      </section>
    </main>
  );
}
