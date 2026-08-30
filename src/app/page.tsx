const projects = [
  {
    number: "01",
    type: "Product strategy · 2024",
    title: "Kindred",
    description:
      "A calmer way for distributed teams to make decisions together. I shaped the product story, navigation, and first-run experience.",
    color: "project-peach",
  },
  {
    number: "02",
    type: "Brand identity · 2023",
    title: "Field Notes",
    description:
      "A flexible identity system for a small-batch publisher championing curious, independent voices.",
    color: "project-lime",
  },
  {
    number: "03",
    type: "Digital experience · 2023",
    title: "Good Measure",
    description:
      "A data-rich climate report made human: editorial pacing, clearer stories, and tools people actually wanted to use.",
    color: "project-lavender",
  },
];

const capabilities = [
  "Product direction",
  "Brand systems",
  "Editorial design",
  "Prototyping",
  "Team facilitation",
  "Creative technology",
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Alex Morgan home">
          AM<span className="wordmark-dot">.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="mailto:hello@alexmorgan.design">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section className="hero section-shell" id="top" aria-labelledby="hero-title">
        <div className="hero-kicker eyebrow">
          <span className="status-dot" aria-hidden="true" />
          Available for select opportunities
        </div>
        <h1 id="hero-title">
          I make thoughtful
          <br />
          <em>things useful.</em>
        </h1>
        <div className="hero-bottom">
          <p className="hero-intro">
            Alex Morgan is a multidisciplinary designer and strategist helping
            ambitious teams turn good ideas into clear, lasting experiences.
          </p>
          <a className="text-link" href="#work">
            See selected work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="work section-shell" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title">A few things I&apos;ve helped bring into the world.</h2>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.number}>
              <div className={`project-art ${project.color}`} aria-hidden="true">
                <span>{project.number}</span>
                <div className="project-shape" />
              </div>
              <div className="project-copy">
                <div>
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}</h3>
                </div>
                <div className="project-detail">
                  <p>{project.description}</p>
                  <span className="project-arrow" aria-hidden="true">↗</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <div className="about-grid">
          <p className="eyebrow">A little about me</p>
          <div>
            <h2 id="about-title">
              Good work lives somewhere between <em>curiosity</em> and
              conviction.
            </h2>
            <p className="about-copy">
              For the last decade, I&apos;ve partnered with founders, teams, and
              organizations who care deeply about what they put into the world.
              My role is to find the signal, make it useful, and give it a form
              people want to spend time with.
            </p>
          </div>
        </div>
        <div className="experience-block">
          <p className="eyebrow">Experience</p>
          <div className="experience-list">
            <div className="experience-row">
              <span>Independent designer & strategist</span>
              <span>2021 — now</span>
            </div>
            <div className="experience-row">
              <span>Design Director, Northstar</span>
              <span>2017 — 2021</span>
            </div>
            <div className="experience-row">
              <span>Senior Designer, Common Ground</span>
              <span>2014 — 2017</span>
            </div>
          </div>
        </div>
      </section>

      <section className="capabilities section-shell" aria-labelledby="capabilities-title">
        <div className="capabilities-intro">
          <p className="eyebrow">What I bring</p>
          <h2 id="capabilities-title">Useful by nature.</h2>
        </div>
        <ul className="capability-list">
          {capabilities.map((capability, index) => (
            <li key={capability}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {capability}
            </li>
          ))}
        </ul>
      </section>

      <section className="contact section-shell" aria-labelledby="contact-title">
        <p className="eyebrow">Have a good one?</p>
        <h2 id="contact-title">
          Let&apos;s make
          <br />
          <em>something matter.</em>
        </h2>
        <a className="contact-link" href="mailto:hello@alexmorgan.design">
          hello@alexmorgan.design <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer section-shell">
        <span>© 2024 Alex Morgan</span>
        <span>Designed with intention</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
