import { FormEvent, useState } from 'react'

type FormState = { name: string; email: string; company: string; message: string }

const initialForm: FormState = { name: '', email: '', company: '', message: '' }

function ArrowUpRight() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [sent, setSent] = useState(false)

  const updateField = (field: keyof FormState, value: string) => {
    setSent(false)
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
    setForm(initialForm)
  }

  return (
    <main className="page-shell">
      <nav className="nav-wrap" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Northstar Studio home">
          <span className="brand-mark">N</span>
          <span>northstar<span className="brand-dot">.</span></span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a className="active" href="#contact">Contact <ArrowUpRight /></a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> Let’s make something matter</div>
        <h1>Have a good<br /><em>feeling</em> about this?</h1>
        <p className="hero-copy">Whether you have a fully formed brief or just a spark of an idea, we’d love to hear what you’re thinking.</p>
      </section>

      <section className="contact-grid" id="contact">
        <aside className="contact-aside">
          <div>
            <p className="section-label">Start a conversation</p>
            <p className="aside-intro">Tell us a little about your project and we’ll get back to you within two business days.</p>
          </div>
          <div className="contact-details">
            <div className="detail-block">
              <span className="detail-label">Email</span>
              <a href="mailto:hello@northstar.studio">hello@northstar.studio <ArrowUpRight /></a>
            </div>
            <div className="detail-block">
              <span className="detail-label">Based in</span>
              <span>Brooklyn, NY<br />Working worldwide</span>
            </div>
            <div className="detail-block">
              <span className="detail-label">Follow along</span>
              <div className="social-links"><a href="#instagram">Instagram</a><a href="#linkedin">LinkedIn</a></div>
            </div>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>What’s your name?<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Your name" /></label>
            <label>Email address<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@company.com" /></label>
          </div>
          <label>Company <span className="optional">(optional)</span><input value={form.company} onChange={(event) => updateField('company', event.target.value)} placeholder="Your company or organization" /></label>
          <label>Tell us about it<textarea required rows={5} value={form.message} onChange={(event) => updateField('message', event.target.value)} placeholder="A few words about your project, timeline, and what you’re hoping to create..." /></label>
          <div className="form-footer">
            <span className="privacy-note">We respect your inbox. No spam, ever.</span>
            <button type="submit">Send inquiry <ArrowUpRight /></button>
          </div>
          {sent && <p className="success" role="status">Thanks — your note is on its way. We’ll be in touch soon.</p>}
        </form>
      </section>

      <footer><span>© 2024 Northstar Studio</span><span>Thoughtful work for a changing world.</span></footer>
    </main>
  )
}

export default App
