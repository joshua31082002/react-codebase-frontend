const ladders = { 4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92 };
const snakes = { 27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41 };
const players = [
  { name: 'Player 1', position: 0, tokenClass: 'token-one' },
  { name: 'Player 2', position: 0, tokenClass: 'token-two' },
];

let currentPlayer = 0;
let gameOver = false;

const board = document.querySelector('#board');
const dice = document.querySelector('#dice');
const rollButton = document.querySelector('#roll-dice');
const newGameButton = document.querySelector('#new-game');
const statusMessage = document.querySelector('#status-message');
const turnLabel = document.querySelector('#turn-label');
const activePlayerName = document.querySelector('#active-player-name');
const activePlayerPosition = document.querySelector('#active-player-position');
const activePlayer = document.querySelector('#active-player');

const getSquareClass = (square) => {
  if (ladders[square]) return 'ladder';
  if (snakes[square]) return 'snake';
  return '';
};

function createBoard() {
  for (let row = 9; row >= 0; row -= 1) {
    const rowSquares = Array.from({ length: 10 }, (_, index) => row * 10 + index + 1);
    if (row % 2 === 1) rowSquares.reverse();

    rowSquares.forEach((square) => {
      const cell = document.createElement('div');
      cell.className = `cell ${getSquareClass(square)}`;
      cell.dataset.square = square;
      cell.innerHTML = `<span class="cell-number">${square}</span>`;

      if (ladders[square]) cell.insertAdjacentHTML('beforeend', `<span class="cell-path">↑ ${ladders[square]}</span>`);
      if (snakes[square]) cell.insertAdjacentHTML('beforeend', `<span class="cell-path">↓ ${snakes[square]}</span>`);
      board.appendChild(cell);
    });
  }
}

function renderTokens() {
  document.querySelectorAll('.cell .token').forEach((token) => token.remove());
  players.forEach((player, index) => {
    if (player.position === 0) return;
    const cell = document.querySelector(`[data-square="${player.position}"]`);
    const token = document.createElement('span');
    token.className = `token ${player.tokenClass}`;
    token.textContent = index + 1;
    token.setAttribute('aria-label', `${player.name} on square ${player.position}`);
    cell?.appendChild(token);
  });
}

function updateScoreboard() {
  players.forEach((player, index) => {
    const row = document.querySelector(index === 0 ? '#player-one-score' : '#player-two-score');
    row.querySelector('b').textContent = player.position;
    row.classList.toggle('active', index === currentPlayer && !gameOver);
  });
}

function updateTurnDisplay() {
  const player = players[currentPlayer];
  turnLabel.textContent = `${player.name}'s turn`;
  activePlayerName.textContent = player.name;
  activePlayerPosition.textContent = player.position ? `On square ${player.position}` : 'At the start';
  activePlayer.className = `player-display ${currentPlayer === 0 ? 'player-one' : 'player-two'}`;
  updateScoreboard();
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function rollDice() {
  if (gameOver) return;
  rollButton.disabled = true;
  dice.classList.remove('rolling');
  void dice.offsetWidth;
  dice.classList.add('rolling');

  const roll = Math.floor(Math.random() * 6) + 1;
  dice.textContent = roll;
  const player = players[currentPlayer];
  const nextPosition = player.position + roll;

  window.setTimeout(() => {
    if (nextPosition > 100) {
      setStatus(`${player.name} rolled ${roll}. You need an exact roll to reach 100.`);
    } else {
      player.position = nextPosition;
      let message = `${player.name} rolled ${roll} and moved to ${nextPosition}.`;
      if (ladders[player.position]) {
        player.position = ladders[player.position];
        message += ` Climb the ladder to ${player.position}!`;
      } else if (snakes[player.position]) {
        player.position = snakes[player.position];
        message += ` Slide down the snake to ${player.position}.`;
      }

      if (player.position === 100) {
        gameOver = true;
        setStatus(`${player.name} wins! Start a new game to play again.`);
        rollButton.textContent = 'Game over';
      } else {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        setStatus(`${message} Pass the dice to ${players[currentPlayer].name}.`);
      }
    }

    renderTokens();
    updateTurnDisplay();
    rollButton.disabled = gameOver;
  }, 500);
}

function resetGame() {
  players.forEach((player) => { player.position = 0; });
  currentPlayer = 0;
  gameOver = false;
  dice.textContent = '?';
  rollButton.disabled = false;
  rollButton.textContent = 'Roll dice';
  setStatus('Roll the dice to begin.');
  renderTokens();
  updateTurnDisplay();
}

createBoard();
resetGame();
rollButton.addEventListener('click', rollDice);
newGameButton.addEventListener('click', resetGame);
