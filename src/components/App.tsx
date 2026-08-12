import { useState } from 'react';
import '@/styles/App.css';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="container">
      <header className="header">
        <h1>Welcome to React + TypeScript + Vite</h1>
        <p>A minimal, scalable one-page application</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Get Started</h2>
          <p>Edit `src/components/App.tsx` and save to test HMR.</p>
          <button onClick={() => setCount((prev) => prev + 1)}>
            Count is: {count}
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024. Built with Vite, React, and TypeScript.</p>
      </footer>
    </div>
  );
}

export default App;
