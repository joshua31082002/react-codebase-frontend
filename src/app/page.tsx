export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card" aria-labelledby="page-title">
        <div className="orb orb-left" aria-hidden="true" />
        <div className="orb orb-right" aria-hidden="true" />
        <p className="eyebrow">A tiny web hello</p>
        <h1 id="page-title">Hello, world.</h1>
        <p className="intro">
          Welcome to your new corner of the internet. Simple, warm, and ready for
          whatever comes next.
        </p>
        <a className="cta" href="mailto:hello@example.com">
          Say hello <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  );
}
