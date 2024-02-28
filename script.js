const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-btn');
const playerOptions = document.getElementsByName('player-option');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let playerVsPlayer = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
  
  if (gameActive && !playerVsPlayer && currentPlayer === 'O') {
    setTimeout(() => {
      makeAiMove();
    }, 1000); // Delay AI move for 1 second for better user experience
  }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.textContent = `${currentPlayer} has won!`;
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes('');
  if (roundDraw) {
    statusDisplay.textContent = 'It\'s a draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `${currentPlayer}'s turn`;
}

function handleRestartGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = ['', '', '', '', '', '', '', '', ''];
  statusDisplay.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = '');

  if (!playerVsPlayer && currentPlayer === 'O') {
    makeAiMove();
  }
}

function makeAiMove() {
  // Simple AI strategy: randomly choose an empty cell
  const emptyCells = gameState.reduce((acc, cell, index) => {
    if (cell === '') {
      acc.push(index);
    }
    return acc;
  }, []);
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const aiMoveIndex = emptyCells[randomIndex];
  
  const aiMoveCell = cells[aiMoveIndex];
  handleCellPlayed(aiMoveCell, aiMoveIndex);
  handleResultValidation();
}

function handlePlayerOptionChange() {
  playerVsPlayer = document.querySelector('input[name="player-option"]:checked').value === 'player';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
playerOptions.forEach(option => option.addEventListener('change', handlePlayerOptionChange));
