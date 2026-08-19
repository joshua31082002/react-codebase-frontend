import Link from 'next/link'

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <nav className="topbar" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="Hello home">
          <span className="brand-mark">✦</span>
          hello.world
        </Link>
        <span className="status-pill"><span className="status-dot" /> online</span>
      </nav>

      <section className="hero" aria-labelledby="welcome-heading">
        <p className="eyebrow">A small beginning</p>
        <h1 id="welcome-heading">
          Hello,<br />
          <em>world.</em>
        </h1>
        <p className="intro">
          Every great idea starts with a first line. This is ours — a quiet place
          to begin something meaningful.
        </p>
        <a className="cta" href="#begin">
          <span>Say hello</span>
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer id="begin" className="footer-note">
        <span>Made with curiosity</span>
        <span className="footer-line" aria-hidden="true" />
        <span>Est. today</span>
      </footer>
    </main>
  )
}
