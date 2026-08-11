import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const isZero = count === 0

  return (
    <main className="page-shell">
      <section className="counter-card" aria-labelledby="counter-title">
        <div className="card-header">
          <span className="eyebrow">Utility / 001</span>
          <span className="status"><span aria-hidden="true" /> Live</span>
        </div>

        <div className="card-content">
          <p className="kicker">Simple. Focused. Yours.</p>
          <h1 id="counter-title">Counter</h1>
          <p className="description">Keep track of a number with a little less noise.</p>

          <div className="count-display" aria-live="polite" aria-atomic="true">
            <span className="count-value">{count}</span>
            <span className="count-label">current value</span>
          </div>

          <div className="controls" aria-label="Counter controls">
            <button
              className="control-button secondary"
              type="button"
              onClick={() => setCount((value) => value - 1)}
              aria-label="Decrease count"
            >
              <span aria-hidden="true">−</span>
            </button>
            <button
              className="control-button primary"
              type="button"
              onClick={() => setCount((value) => value + 1)}
              aria-label="Increase count"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <button
            className="reset-button"
            type="button"
            onClick={() => setCount(0)}
            disabled={isZero}
          >
            Reset counter
          </button>
        </div>

        <footer className="card-footer">
          <span>Built for everyday momentum</span>
          <span className="footer-mark" aria-hidden="true">↗</span>
        </footer>
      </section>
    </main>
  )
}

export default App
