let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let isComputerMode = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const pvpButton = document.getElementById('pvp');
const pvcButton = document.getElementById('pvc');
const gameContainer = document.getElementById('game-container');

pvpButton.addEventListener('click', () => startGame(false));
pvcButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', restartGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function startGame(computerMode) {
    isComputerMode = computerMode;
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameContainer.classList.remove('hidden');
    pvpButton.style.display = 'none';
    pvcButton.style.display = 'none';
    updateStatus();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.cursor = 'pointer';
    });
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (gameBoard[index] !== '' || !gameActive) return;

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
        statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
        endGame();
    } else if (gameBoard.every(cell => cell !== '')) {
        statusDisplay.textContent = "It's a Draw!";
        endGame();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
        if (isComputerMode && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    // Simple AI: Pick a random empty cell
    const emptyCells = gameBoard
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);
    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';

    if (checkWin()) {
        statusDisplay.textContent = 'Computer Wins!';
        endGame();
    } else if (gameBoard.every(cell => cell !== '')) {
        statusDisplay.textContent = "It's a Draw!";
        endGame();
    } else {
        currentPlayer = 'X';
        updateStatus();
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === currentPlayer);
    });
}

function updateStatus() {
    statusDisplay.textContent = isComputerMode && currentPlayer === 'O' 
        ? "Computer's Turn" 
        : `Player ${currentPlayer}'s Turn`;
}

function endGame() {
    gameActive = false;
    cells.forEach(cell => cell.style.cursor = 'not-allowed');
}

function restartGame() {
    gameActive = false;
    gameContainer.classList.add('hidden');
    pvpButton.style.display = 'inline-block';
    pvcButton.style.display = 'inline-block';
    statusDisplay.textContent = '';
}