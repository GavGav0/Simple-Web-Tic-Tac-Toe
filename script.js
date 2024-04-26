let currentPlayer = 'X';
let gameActive = true;
let paused = false;
let gridSize = 3;
let winLength = 3;
let totalCells = gridSize * gridSize;
let gameState = Array(totalCells).fill('');
let winConditions = generateWinConditions();

// Load visitor count from localStorage
let visitorCount = localStorage.getItem('visitorCount');
if (visitorCount === null) {
  visitorCount = 0;
} else {
  visitorCount = parseInt(visitorCount);
}

// Display visitor count on page load
document.getElementById('visitorCount').textContent = visitorCount;

function generateWinConditions() {
  let conditions = [];

  // Rows
  for (let i = 0; i < totalCells; i += gridSize) {
    for (let j = i; j <= i + gridSize - winLength; j++) {
      let row = [];
      for (let k = j; k < j + winLength; k++) {
        row.push(k);
      }
      conditions.push(row);
    }
  }

  // Columns
  for (let i = 0; i < gridSize; i++) {
    for (let j = i; j <= totalCells - winLength + i; j += gridSize) {
      let col = [];
      for (let k = j; k < j + winLength * gridSize; k += gridSize) {
        col.push(k);
      }
      conditions.push(col);
    }
  }

  // Diagonals
  for (let i = 0; i <= totalCells - winLength; i++) {
    if (i % gridSize <= gridSize - winLength) {
      let diagonal = [];
      for (let j = 0; j < winLength; j++) {
        diagonal.push(i + j * (gridSize + 1));
      }
      conditions.push(diagonal);
    }
    if (i % gridSize >= winLength - 1) {
      let diagonal = [];
      for (let j = 0; j < winLength; j++) {
        diagonal.push(i + j * (gridSize - 1));
      }
      conditions.push(diagonal);
    }
  }

  return conditions;
}

function makeMove(cellIndex) {
  if (!gameActive || paused || gameState[cellIndex] !== '') {
    return;
  }

  gameState[cellIndex] = currentPlayer;
  document.getElementsByClassName('cell')[cellIndex].innerText = currentPlayer;
  if (checkWin()) {
    endGame(`Player ${currentPlayer} wins!`);
  } else if (!gameState.includes('')) {
    endGame("It's a draw!");
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function checkWin() {
  return winConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === currentPlayer;
    });
  });
}

function resetGame() {
  gridSize = parseInt(document.getElementById('gridSizeInput').value);
  winLength = parseInt(document.getElementById('winLengthInput').value);
  if (winLength > gridSize) {
    winLength = gridSize;
    document.getElementById('winLengthInput').value = gridSize;
  }
  totalCells = gridSize * gridSize;
  gameState = Array(totalCells).fill('');
  currentPlayer = 'X';
  gameActive = true;
  paused = false;
  winConditions = generateWinConditions();
  document.getElementById('board').style.pointerEvents = 'auto';
  document.getElementById('board').innerHTML = '';
  for (let i = 0; i < totalCells; i++) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.onclick = function() { makeMove(i); };
    document.getElementById('board').appendChild(cell);
  }
  document.getElementById('board').style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  hideEndScreen();
}

function togglePause() {
  paused = !paused;
  if (paused) {
    document.getElementById('board').style.pointerEvents = 'none';
    document.querySelector('button').innerText = 'Resume';
  } else {
    document.getElementById('board').style.pointerEvents = 'auto';
    document.querySelector('button').innerText = 'Pause';
  }
}

function endGame(message) {
  document.getElementById('endMessage').innerText = message;
  document.getElementById('endScreen').style.display = 'flex';
}

function hideEndScreen() {
  document.getElementById('endScreen').style.display = 'none';
}

function restartGame() {
  hideEndScreen();
  resetGame();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Function to increase visitor count
function increaseVisitorCount() {
  // Increment visitor count
  visitorCount++;
  // Update visitor count in localStorage
  localStorage.setItem('visitorCount', visitorCount);
  // Display updated visitor count on the page
  document.getElementById('visitorCount').textContent = visitorCount;
}

// Call increaseVisitorCount function when the page loads
window.onload = increaseVisitorCount;
