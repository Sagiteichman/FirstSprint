'use strict';

const BOMB = '⚽';
const FLAG = '🚩';

const LEVELS = {
  BEGINNER: { ROWS: 4, COLS: 4, MINES: 2, LIVES: 2 },
  MEDIUM: { ROWS: 8, COLS: 8, MINES: 14, LIVES: 4 },
  EXPERT: { ROWS: 12, COLS: 12, MINES: 32, LIVES: 6 },
};

let gBoard = [];
let gLevel = LEVELS.BEGINNER;
let gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: LEVELS.BEGINNER.LIVES,
  timerInterval: null,
};

let isFirstClick = true;

document.addEventListener('DOMContentLoaded', onInit);

function onInit() {
  restartGame(gLevel);
}

function restartGame(level) {
  gLevel = level || gLevel;
  gBoard = buildBoard(gLevel.ROWS, gLevel.COLS);
  gGame.isOn = true;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gGame.lives = gLevel.LIVES;
  isFirstClick = true;

  const victoryMsg = document.querySelector('.victory');
  if (victoryMsg) victoryMsg.style.opacity = 0;
  if (gGame.timerInterval) clearInterval(gGame.timerInterval);

  renderBoard();
  resetBtn();
  updateLivesCounter();
}

function onCellClicked(event, row, col) {
  if (!gGame.isOn) return;

  const cell = gBoard[row][col];

  if (isFirstClick) {
    isFirstClick = false;
    startTimer();
    setMines(gLevel.MINES, row, col);
    renderBoard();
  }

  if (event.button === 2) {
    if (!cell.isShown) {
      cell.isMarked = !cell.isMarked;
      gGame.markedCount += cell.isMarked ? 1 : -1;
      renderBoard();
      checkGameOver();
    }
    return;
  }

  if (cell.isMarked || cell.isShown) return;

  if (cell.isMine) {
    if (gGame.lives === 1) {
      gGame.isOn = false;
      showGameOverEmojis(false);
      revealBombs();
    } else {
      cell.isShown = true;
      gGame.lives--;
      updateLivesCounter();
      renderBoard();
      checkGameOver();
    }
    return;
  }

  if (!cell.isShown) {
    revealCell(gBoard, row, col);
    if (cell.minesAroundCount === 0) {
      expandShown(gBoard, row, col);
    }
    renderBoard();
    checkGameOver();
  }
}

function expandShown(board, row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || j < 0 || i >= board.length || j >= board[i].length || (i === row && j === col)) continue;
      if (!board[i][j].isMine && !board[i][j].isShown) {
        revealCell(board, i, j);
        if (board[i][j].minesAroundCount === 0) expandShown(board, i, j);
      }
    }
  }
}

function setMines(mines, initialRow, initialCol) {
  const rows = gLevel.ROWS;
  const cols = gLevel.COLS;
  let placedMines = 0;

  while (placedMines < mines) {
    const row = getRandomInt(0, rows - 1);
    const col = getRandomInt(0, cols - 1);
    const currCell = gBoard[row][col];

    if (currCell.isMine || (row === initialRow && col === initialCol)) continue;
    currCell.isMine = true;
    placedMines++;
  }

  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      countNeighborMines(i, j, gBoard);
    }
  }
}

function buildBoard(rows, cols) {
  const mat = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      row.push(cell);
    }
    mat.push(row);
  }
  return mat;
}

function renderBoard() {
  let strHTML = `<table><tbody>`;
  for (let i = 0; i < gLevel.ROWS; i++) {
    strHTML += `<tr>`;
    for (let j = 0; j < gLevel.COLS; j++) {
      const cell = gBoard[i][j];
      let className = 'cell';

      if (cell.isShown) {
        className += cell.isMine ? ' mine cell-revealed' : ' cell-revealed';
        strHTML += `<td class="${className}">${cell.isMine ? BOMB : cell.minesAroundCount || ''}</td>`;
      } else if (cell.isMarked) {
        className += ' marked';
        strHTML += `<td class="${className}"> ${FLAG} </td>`;
      } else {
        className += ' empty';
        strHTML += `<td class="${className}" onmousedown="onCellClicked(event, ${i}, ${j})"></td>`;
      }
    }
    strHTML += '</tr>';
  }
  strHTML += `</tbody></table>`;

  const elGrid = document.querySelector('.grid');
  if (elGrid) {
    elGrid.innerHTML = strHTML;
    elGrid.addEventListener('contextmenu', (event) => event.preventDefault());
  } else {
    console.error('Grid container not found.');
  }

  updateLivesCounter();
}

function countNeighborMines(cellI, cellJ, board) {
  let mineCount = 0;
  for (let i = cellI - 1; i <= cellI + 1; i++) {
    for (let j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i < 0 || j < 0 || i >= board.length || j >= board[i].length || (i === cellI && j === cellJ)) continue;
      if (board[i][j].isMine) mineCount++;
    }
  }
  board[cellI][cellJ].minesAroundCount = mineCount;
}

function revealCell(board, i, j) {
  const currCell = board[i][j];
  if (currCell.isShown || currCell.isMarked) return;

  currCell.isShown = true;
  gGame.shownCount++;
}

function revealBombs() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      const currCell = gBoard[i][j];
      if (currCell.isMine || currCell.isShown) {
        currCell.isShown = true;
      }
    }
  }
  renderBoard();
}

function setLevel(level) {
  gLevel = level;
  restartGame(level);
}

function checkGameOver() {
  const totalCells = gLevel.ROWS * gLevel.COLS;
  const nonMineCells = totalCells - gLevel.MINES;
  let minesMarked = true;
  let nonMineCellsShown = true;

  for (let i = 0; i < gLevel.ROWS; i++) {
    for (let j = 0; j < gLevel.COLS; j++) {
      const cell = gBoard[i][j];
      if (cell.isMine && !cell.isMarked) {
        minesMarked = false;
      }
      if (!cell.isMine && !cell.isShown) {
        nonMineCellsShown = false;
      }
    }
  }

  if (minesMarked && nonMineCellsShown) {
    gGame.isOn = false;
    showGameOverEmojis(true);
  }
}

function showGameOverEmojis(isWin) {
  const restartBtn = document.querySelector('.restart-Btn');
  const victoryMsg = document.querySelector('.victory');

  if (isWin) {
    restartBtn.textContent = '😎';
    if (victoryMsg) {
      victoryMsg.style.opacity = 1;
    }
  } else {
    restartBtn.textContent = '🤯';
  }
}

function resetBtn() {
  const restartBtn = document.querySelector('.restart-Btn');
  if (restartBtn) {
    restartBtn.textContent = '😃';
  }
}

function updateLivesCounter() {
  const elLivesCounter = document.querySelector('.lives');
  if (elLivesCounter) {
    elLivesCounter.textContent = `${gGame.lives} Lives Left`;
  }
}

function startTimer() {
  gGame.secsPassed = 0;
  gGame.timerInterval = setInterval(() => {
    gGame.secsPassed++;
    const elTimer = document.querySelector('.timer');
    if (elTimer) {
      elTimer.textContent = `Time: ${gGame.secsPassed}s`;
    }
  }, 1000);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
