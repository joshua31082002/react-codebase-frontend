import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function App() {
  return (
    <main className="page-shell">
      <div className="glow glow-top" aria-hidden="true" />
      <div className="glow glow-bottom" aria-hidden="true" />
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Hello home"><span className="brand-mark">H</span><span>hello</span></a>
        <span className="nav-note">A tiny beginning</span>
      </nav>
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow"><span className="eyebrow-dot" /> Nice to meet you</p>
        <h1 id="hero-title">Hello,<br /><em>world.</em></h1>
        <p className="hero-copy">Every great idea starts with a simple introduction. This is ours.</p>
        <a className="hero-link" href="#start"><span>Let&apos;s get started</span><span className="arrow" aria-hidden="true">↗</span></a>
      </section>
      <footer id="start" className="site-footer"><span>Built with curiosity</span><span className="footer-rule" aria-hidden="true" /><span>01 / 01</span></footer>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
