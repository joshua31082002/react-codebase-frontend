import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function App() {
  return (
    <main className="page-shell">
      <div className="glow" aria-hidden="true" />
      <section className="hero" aria-labelledby="hello-heading">
        <p className="eyebrow">A tiny beginning</p>
        <h1 id="hello-heading">Hello, world.</h1>
        <p className="intro">A simple message with a warm welcome.</p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
