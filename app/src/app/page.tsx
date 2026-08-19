import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="page-wrap">
      <header className="topbar">
        <div className="brand"><span className="brand-dot" aria-hidden="true" />COMPASS</div>
        <span className="status"><span aria-hidden="true" />AI thinking partner</span>
      </header>
      <div className="hero">
        <p className="kicker">A clearer way forward</p>
        <h1>Make the next<br /><em>move</em> obvious.</h1>
        <p className="lede">A focused AI copilot for shaping ideas, making decisions, and getting unstuck.</p>
      </div>
      <Chat />
      <footer className="footer"><span>Built with Mastra</span><span>Private by default · No history stored</span></footer>
    </main>
  );
}
