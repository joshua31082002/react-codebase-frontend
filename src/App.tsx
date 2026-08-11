import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="card">
      <h1>Counter App</h1>
      <div className="count-display">
        <p>{count}</p>
      </div>
      <div className="button-group">
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    </div>
  )
}

export default App
