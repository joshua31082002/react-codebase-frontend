import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, CircleHelp, Dice5, Flag, RotateCcw, Trophy } from 'lucide-react'

type Player = { id: number; name: string; color: 'coral' | 'teal'; position: number }
type Move = { player: string; roll: number; from: number; to: number; detail: string }

const snakes: Record<number, number> = { 98: 78, 95: 75, 92: 88, 64: 60, 48: 26, 36: 6, 25: 3 }
const ladders: Record<number, number> = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 }
const playerColors = { coral: '#ec6a4f', teal: '#187d79' }

function getBoardNumbers() {
  return Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10)
    const start = 100 - row * 10
    const numbers = Array.from({ length: 10 }, (_, cell) => start - cell)
    return row % 2 === 0 ? numbers : numbers.reverse()
  }).flat()
}

const boardNumbers = getBoardNumbers()

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Maya', color: 'coral', position: 1 },
    { id: 2, name: 'Theo', color: 'teal', position: 1 },
  ])
  const [turn, setTurn] = useState(0)
  const [lastRoll, setLastRoll] = useState<number | null>(null)
  const [history, setHistory] = useState<Move[]>([])
  const [winner, setWinner] = useState<Player | null>(null)
  const [rolling, setRolling] = useState(false)

  const currentPlayer = players[turn]
  const occupied = useMemo(() => new Map(players.map((player) => [player.position, player])), [players])

  const rollDice = () => {
    if (rolling || winner) return
    setRolling(true)
    window.setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1
      const from = currentPlayer.position
      const stepped = from + roll > 100 ? from : from + roll
      const destination = ladders[stepped] ?? snakes[stepped] ?? stepped
      const detail = ladders[stepped] ? `Climbed to ${destination}` : snakes[stepped] ? `Slid to ${destination}` : stepped === from ? 'Needs an exact roll' : `Moved to ${destination}`
      const updatedPlayer = { ...currentPlayer, position: destination }
      setPlayers((previous) => previous.map((player) => (player.id === currentPlayer.id ? updatedPlayer : player)))
      setLastRoll(roll)
      setHistory((previous) => [{ player: currentPlayer.name, roll, from, to: destination, detail }, ...previous].slice(0, 6))
      if (destination === 100) setWinner(updatedPlayer)
      else setTurn((previous) => (previous + 1) % players.length)
      setRolling(false)
    }, 420)
  }

  const resetGame = () => {
    setPlayers((previous) => previous.map((player) => ({ ...player, position: 1 })))
    setTurn(0)
    setLastRoll(null)
    setHistory([])
    setWinner(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">S</span><span>Snake <i>&</i> Ladder Club</span></div>
        <div className="header-actions"><span className="round-pill">ROUND 01</span><button className="icon-button" aria-label="How to play"><CircleHelp size={19} /></button></div>
      </header>

      <section className="intro">
        <div><p className="eyebrow">CLASSIC BOARD GAME</p><h1>Race to the top.<br /><em>Watch your step.</em></h1></div>
        <p className="intro-copy">Roll the dice, climb every ladder,<br className="desktop-only" /> and dodge the snakes.</p>
      </section>

      <section className="game-layout">
        <div className="board-wrap">
          <div className="board-label top-left">100</div><div className="board-label bottom-right">01</div>
          <div className="board" aria-label="Snake and ladder game board">
            {boardNumbers.map((number) => {
              const occupant = occupied.get(number)
              const ladder = ladders[number]
              const snake = snakes[number]
              return <div className={`cell ${number % 2 === 0 ? 'even' : 'odd'} ${number === 100 ? 'finish' : ''}`} key={number}>
                <span className="cell-number">{String(number).padStart(2, '0')}</span>
                {ladder && <span className="board-icon ladder" title={`Ladder to ${ladder}`}><ArrowUp size={18} /></span>}
                {snake && <span className="board-icon snake" title={`Snake to ${snake}`}><ArrowDown size={18} /></span>}
                {occupant && <span className="token-stack">{players.filter((player) => player.position === number).map((player) => <span key={player.id} className="token" style={{ backgroundColor: playerColors[player.color] }} title={player.name}>{player.name.slice(0, 1)}</span>)}</span>}
              </div>
            })}
          </div>
          <div className="board-footer"><span>START</span><span>FINISH</span></div>
        </div>

        <aside className="sidebar">
          <div className="turn-card">
            <div className="turn-heading"><span className="live-dot" /> CURRENT TURN</div>
            <div className="player-turn"><span className="large-token" style={{ backgroundColor: playerColors[currentPlayer.color] }}>{currentPlayer.name.slice(0, 1)}</span><div><strong>{winner ? `${winner.name} wins!` : `${currentPlayer.name}'s turn`}</strong><span>{winner ? 'What a finish.' : 'Roll the dice to move'}</span></div></div>
            <div className={`dice-result ${rolling ? 'is-rolling' : ''}`}><Dice5 size={40} strokeWidth={1.4} /><strong>{lastRoll ?? '—'}</strong></div>
            <button className="roll-button" onClick={rollDice} disabled={rolling || Boolean(winner)}><Dice5 size={19} /> {rolling ? 'ROLLING...' : winner ? 'GAME OVER' : 'ROLL THE DICE'}</button>
            {winner && <button className="reset-button" onClick={resetGame}><RotateCcw size={16} /> PLAY AGAIN</button>}
          </div>

          <div className="players-card"><div className="section-title"><span>PLAYERS</span><span className="player-count">{players.length}</span></div>{players.map((player, index) => <div className={`player-row ${index === turn && !winner ? 'active' : ''}`} key={player.id}><span className="small-token" style={{ backgroundColor: playerColors[player.color] }}>{player.name.slice(0, 1)}</span><span className="player-name">{player.name}</span><span className="player-position">{player.position === 1 ? 'Start' : `Square ${player.position}`}</span></div>)}</div>

          <div className="history-card"><div className="section-title"><span>RECENT MOVES</span><span className="history-count">{history.length ? `0${Math.min(history.length, 6)}` : '—'}</span></div>{history.length === 0 ? <p className="empty-history">Your moves will appear here.<br />Good luck out there!</p> : <div className="history-list">{history.map((move, index) => <div className="history-row" key={`${move.player}-${index}`}><span className="history-roll">{move.roll}</span><div><strong>{move.player}</strong><span>{move.detail}</span></div><span className="history-to">{move.to}</span></div>)}</div>}</div>
        </aside>
      </section>
      <footer className="footer"><span><Flag size={14} /> First to land exactly on 100 wins</span><span>© 2024 S&L CLUB</span></footer>
      {winner && <div className="winner-badge"><Trophy size={18} /> {winner.name} reached the finish!</div>}
    </main>
  )
}

export default App
