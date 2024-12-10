const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-selection button');
const difficultyButtons = document.querySelectorAll('.difficulty-selection button');
const modeSelection = document.querySelector('.mode-selection');
const difficultySelection = document.querySelector('.difficulty-selection');
const muteButton = document.getElementById('mute-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let vsComputer = false;
let difficulty = '';

// Sound elements
const keypressSound = document.getElementById('keypress-sound');
const startSound = document.getElementById('start-sound');
const winSound = document.getElementById('win-sound');
const tieSound = document.getElementById('tie-sound');

// Set initial volume of start sound
startSound.volume = 1;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const quotes = [
  "Victory is sweet!",
  "Congratulations, you did it!",
  "Winner, winner, chicken dinner!",
  "You're unstoppable!",
  "Champion of the game!",
  "You played like a pro!",
  "Fantastic win!",
  "Amazing strategy!"
];

// Loading animation
function showLoadingAnimation(callback) {
  statusText.textContent = "Loading...";
  setTimeout(() => {
    startSound.play();
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    callback();
  }, 2000);
}

// Mute/Unmute functionality
let isMuted = false;
muteButton.addEventListener('click', () => {
  isMuted = !isMuted;
  startSound.muted = isMuted;
  keypressSound.muted = isMuted;
  winSound.muted = isMuted;
  tieSound.muted = isMuted;
  muteButton.textContent = isMuted ? 'Unmute Music' : 'Mute Music';
});

// Start the game
function startGame() {
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', () => {
    showLoadingAnimation(resetGame);
  });
}

// Handle Mode Selection
modeButtons.forEach(button => {
  button.addEventListener('click', () => {
    vsComputer = button.id === 'mode-human-vs-computer';
    statusText.textContent = vsComputer ? "Select difficulty to start!" : `Player ${currentPlayer}'s turn`;
    gameActive = !vsComputer;
    modeSelection.classList.add('hidden');
    resetButton.classList.remove('hidden');
    if (vsComputer) difficultySelection.classList.remove('hidden');
  });
});

// Handle Difficulty Selection
difficultyButtons.forEach(button => {
  button.addEventListener('click', () => {
    difficulty = button.id.replace('-mode', '');
    gameActive = true;
    difficultySelection.classList.add('hidden');
    showLoadingAnimation(() => {
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    });
  });
});

// Handle cell clicks (Human move)
function handleCellClick(event) {
  keypressSound.play();
  const cell = event.target;
  const index = cell.dataset.index;

  if (board[index] !== '' || !gameActive) return;

  updateCell(cell, index);
  if (vsComputer && currentPlayer === 'O') makeComputerMove();
}

// Update cell after a move
function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('clicked');
  checkWinner();
}

// Check if a player has won
function checkWinner() {
  let roundWon = false;

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    statusText.textContent = `Player ${currentPlayer} wins! ${randomQuote}`;
    gameActive = false;
    winSound.play();
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
  } else if (!board.includes('')) {
    statusText.textContent = "It's a tie!";
    gameActive = false;
    tieSound.play();
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Reset the game
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = !vsComputer || difficulty !== ''; // Ensure the game starts only after difficulty is selected
  difficulty = ''; // Reset difficulty
  statusText.textContent = vsComputer ? "Select difficulty to start!" : "Choose a mode to start!";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  modeSelection.classList.remove('hidden');
  difficultySelection.classList.add('hidden');
  resetButton.classList.add('hidden');
  startGame();
}

// Make a move for the computer
function makeComputerMove() {
  let emptyCells = board
    .map((val, index) => (val === '' ? index : null))
    .filter(val => val !== null);

  let index;
  if (difficulty === 'normal') {
    // Select a random empty cell
    index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else if (difficulty === 'moderate') {
    // Add smarter AI logic here
    index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else if (difficulty === 'tough') {
    // Add unbeatable AI logic here
    index = emptyCells[0]; // Placeholder for now
  }

  if (index !== undefined) {
    board[index] = 'O';
    cells[index].textContent = 'O';
    cells[index].classList.add('clicked');
    checkWinner();
  }
}

startGame();
