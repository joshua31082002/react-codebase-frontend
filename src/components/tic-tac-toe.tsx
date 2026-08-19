"use client";

import { useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type Winner = { player: Player; line: number[] };

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function getWinner(board: Cell[]): Winner | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [scores, setScores] = useState<Record<Player, number>>({ X: 0, O: 0 });

  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const isOver = Boolean(winner || isDraw);

  function play(index: number) {
    if (board[index] || isOver) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextWinner = getWinner(nextBoard);

    setBoard(nextBoard);
    if (nextWinner) {
      setScores((current) => ({ ...current, [nextWinner.player]: current[nextWinner.player] + 1 }));
    } else if (!nextBoard.every(Boolean)) {
      setCurrentPlayer((player) => (player === "X" ? "O" : "X"));
    }
  }

  function resetRound() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
  }

  function resetGame() {
    resetRound();
    setScores({ X: 0, O: 0 });
  }

  const status = winner ? `${winner.player} wins the round` : isDraw ? "It’s a draw" : `${currentPlayer}'s turn`;

  return (
    <main className="game-shell">
      <div className="game-card">
        <header className="game-header">
          <div>
            <p className="eyebrow">Two player game</p>
            <h1>Three in a row<span className="title-mark">.</span></h1>
            <p className="subtitle">A tiny pause for a little friendly competition.</p>
          </div>
          <div className="round-badge" aria-label="Round number">
            <span>ROUND</span>
            <strong>{scores.X + scores.O + 1}</strong>
          </div>
        </header>

        <section className="scoreboard" aria-label="Scoreboard">
          <div className={`score ${currentPlayer === "X" && !isOver ? "active" : ""}`}>
            <span className="player-symbol symbol-x">X</span>
            <div><span>Player one</span><strong>{scores.X}</strong></div>
          </div>
          <div className="score-divider" aria-hidden="true">vs</div>
          <div className={`score score-right ${currentPlayer === "O" && !isOver ? "active" : ""}`}>
            <div><span>Player two</span><strong>{scores.O}</strong></div>
            <span className="player-symbol symbol-o">O</span>
          </div>
        </section>

        <div className="status" role="status" aria-live="polite">
          <span className={`status-dot ${isOver ? "complete" : ""}`} />
          {status}
        </div>

        <div className="board" role="grid" aria-label="Tic tac toe board">
          {board.map((cell, index) => {
            const isWinningCell = winner?.line.includes(index);
            return (
              <button
                className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ""} ${isWinningCell ? "winning" : ""}`}
                key={index}
                onClick={() => play(index)}
                aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}, empty`}
                role="gridcell"
                disabled={Boolean(cell) || isOver}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <footer className="game-footer">
          <button className="reset-button" onClick={resetRound}>New round <span>↗</span></button>
          <button className="quiet-button" onClick={resetGame}>Reset score</button>
        </footer>
      </div>
      <p className="footer-note">Make your mark · Take your time</p>
    </main>
  );
}
