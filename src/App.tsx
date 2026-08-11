import React, { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <h1>Counter App</h1>
      <div className="counter-display">
        <p>Count: <span className="count">{count}</span></p>
      </div>
      <div className="button-group">
        <button onClick={() => setCount(count - 1)}>
          Decrease
        </button>
        <button onClick={() => setCount(0)}>
          Reset
        </button>
        <button onClick={() => setCount(count + 1)}>
          Increase
        </button>
      </div>
    </div>
  )
}

export default App
