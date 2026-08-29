const logos = ["Northstar", "Vertex", "Loom", "Hightide", "Arc"];

const features = [
  {
    number: "01",
    title: "See the whole picture",
    copy: "Bring projects, people, and priorities into one calm, clear workspace.",
    accent: "coral",
  },
  {
    number: "02",
    title: "Move work forward",
    copy: "Turn decisions into momentum with lightweight workflows your team actually uses.",
    accent: "lime",
  },
  {
    number: "03",
    title: "Make room for better",
    copy: "Automate the busywork and give your best thinking somewhere to land.",
    accent: "cream",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero-section" id="top">
        <nav className="site-nav container" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Relay home">
            <LogoMark />
            <span>relay</span>
          </a>
          <div className="nav-links">
            <a href="#why">Why Relay</a>
            <a href="#stories">Customer stories</a>
            <a href="#pricing">Pricing</a>
          </div>
          <a className="button button-small button-outline" href="#contact">
            Book a demo <ArrowIcon />
          </a>
        </nav>

        <div className="hero-grid container">
          <div className="hero-copy reveal-up">
            <p className="eyebrow"><span className="eyebrow-dot" />The operating system for ambitious teams</p>
            <h1>Make good work <em>inevitable.</em></h1>
            <p className="hero-lede">Relay gives your team the clarity, rhythm, and space to do the work that matters most.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">Start a conversation <ArrowIcon /></a>
              <a className="text-link" href="#why">See how it works <ArrowIcon /></a>
            </div>
            <p className="microcopy">No credit card required <span>·</span> Set up in minutes</p>
          </div>

          <div className="hero-art reveal-up delay-one" aria-label="Relay workspace preview" role="img">
            <div className="art-glow" />
            <div className="workspace-window">
              <div className="window-bar"><span className="window-dots"><i /><i /><i /></span><span className="window-label">relay / weekly pulse</span><span className="window-menu">•••</span></div>
              <div className="workspace-body">
                <aside className="workspace-sidebar"><div className="mini-brand"><LogoMark /></div><span className="side-line active" /><span className="side-line" /><span className="side-line short" /><span className="side-spacer" /><span className="side-line" /><span className="side-line short" /></aside>
                <div className="workspace-main"><div className="workspace-heading"><div><span className="tiny-label">MONDAY, OCTOBER 14</span><h2>Good morning, team.</h2></div><span className="avatar">JM</span></div><div className="progress-row"><span>Team momentum</span><strong>82%</strong><div className="progress-track"><span /></div></div><div className="work-cards"><article className="work-card featured"><span className="card-kicker">FOCUS THIS WEEK</span><h3>Launch the next<br />chapter.</h3><div className="card-footer"><span>6 people aligned</span><span className="avatars"><i>AK</i><i>RC</i><i>+4</i></span></div></article><article className="work-card"><span className="card-kicker">IN MOTION</span><div className="metric">24 <small>tasks</small></div><div className="tiny-bars"><i /><i /><i /><i /><i /></div><span className="card-note">Across 4 projects</span></article></div><div className="workspace-bottom"><span>UP NEXT</span><strong>Ship the new onboarding flow</strong><span className="status-pill">On track</span></div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-note">Scroll to explore <span>↓</span></div>
      </section>

      <section className="logo-strip container" aria-label="Trusted by teams at">
        <p>Trusted by teams building what&apos;s next</p>
        <div className="logos">{logos.map((logo) => <span key={logo}>{logo}</span>)}</div>
      </section>

      <section className="intro-section container" id="why">
        <p className="eyebrow"><span className="eyebrow-dot" />A better way to work</p>
        <div className="intro-heading"><h2>Clarity is a <span>competitive advantage.</span></h2><p>When everyone knows what matters, progress stops being a guessing game. Relay turns scattered work into a shared sense of direction.</p></div>
        <div className="feature-list">{features.map((feature) => <article className={`feature-row accent-${feature.accent}`} key={feature.number}><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.copy}</p><span className="feature-arrow"><ArrowIcon /></span></article>)}</div>
      </section>

      <section className="story-section" id="stories">
        <div className="story-inner container"><div className="story-quote"><span className="quote-mark">“</span><blockquote>Relay helped us trade the feeling of being busy for the feeling of being in control.</blockquote><div className="quote-author"><span className="author-avatar">SL</span><span><strong>Sam Lee</strong><small>COO, Northstar</small></span></div></div><div className="story-stat"><strong>3.4<span>×</span></strong><p>faster from idea<br />to shipped</p><span className="stat-line" /></div></div>
      </section>

      <section className="cta-section container" id="contact">
        <div className="cta-card"><div><p className="eyebrow"><span className="eyebrow-dot" />Make momentum a habit</p><h2>Less noise.<br /><em>More signal.</em></h2></div><div className="cta-side"><p>Bring your team&apos;s best work into focus.</p><a className="button button-dark" href="mailto:hello@relay.example">Talk to us <ArrowIcon /></a></div></div>
      </section>

      <footer className="site-footer container"><a className="brand" href="#top"><LogoMark /><span>relay</span></a><p>For teams with somewhere to go.</p><div className="footer-links"><a href="#why">Product</a><a href="#stories">Stories</a><a href="#pricing">Pricing</a><a href="mailto:hello@relay.example">Contact</a></div><span className="copyright">© 2024 Relay</span></footer>
    </main>
  );
}
