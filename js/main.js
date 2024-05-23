'use strict';
const BOMB = '⚽'
const FLAG = '🚩';

const LEVELS = {
  BEGINNER: { ROWS: 9, COLS: 9, MINES: 10 },
  MEDIUM: { ROWS: 16, COLS: 16, MINES: 40 },
  EXPERT: { ROWS: 16, COLS: 30, MINES: 99 },
};

let gBoard = [];
let gLevel = LEVELS.BEGINNER;
let gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3
};

function onInit() {
  restartGame(gLevel);
}

function restartGame(level) {
  gLevel = level || gLevel;
  gBoard = buildBoard(gLevel.ROWS, gLevel.COLS);
  gGame.isOn = true;
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.lives = 4
  isFirstClick = true
  clearInterval(gGame.timerInterval)
  renderBoard();
  resetBtn()
}


var isFirstClick = true

function onCellClicked(event, row, col) {
  if (!gGame.isOn) return;

  var cell = gBoard[row][col]

  if (isFirstClick) {
    while (cell.isMine) {
      restartGame(gLevel)
      return
    }
    isFirstClick = false
    setMines(gLevel.MINES, row, col)
  }

  if (event.button === 2) { //right click / flag
    if (!cell.isShown) {
      cell.isMarked = !cell.isMarked;
      console.log('Marked changed:', cell.isMarked)
      gGame.markedCount += cell.isMarked ? 1 : -1;
      checkGameOver()
      renderBoard();
    }
    return
  }

  if (cell.isMine) {
    if (gGame.lives === 1) {
      gGame.isOn = false;
      showGameOverEmojis(gGame.isOn)
      revealBombs();
      return;
    } else {
      console.log('Lives remaining:', gGame.lives);
      gGame.lives--;
      showLivesCounter();
      renderBoard();
      return;
    }
  }

  if (!cell.isShown && !cell.isMarked) {
    revealCell(gBoard, row, col);
    checkGameOver();
    for (var i = row - 1; i <= row + 1; i++) {
      for (var j = col - 1; j <= col + 1; j++) {
        if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[i].length || (i === row && j === col)) continue;
        if (!gBoard[i][j].isMine) {
          // console.log('is not a mine check:', gBoard[i][j].isMine)
          revealCell(gBoard, i, j)
        }
      }
    }
  }
  // updateTimer()
}

function showLivesCounter() {
  const elLivesCounter = document.querySelector('.lives');
  elLivesCounter.style.opacity = 1
  setTimeout(() => {
    elLivesCounter.style.opacity = 0
  }, 1000);
}

function showVictoryMsg(){
  const elVictoryMsg = document.querySelector('.victory');
  elVictoryMsg.style.opacity = 1
  setTimeout(() => {
    elVictoryMsg.style.opacity = 0
  }, 5000);
}
  

function setMines(mines) {
  const rows = gLevel.ROWS;
  const cols = gLevel.COLS;
  gGame.shownCount = 0
  gGame.markedCount = 0
  for (var i = 0; i < mines; i++) {
    var row = getRandomInt(0, rows - 1);
    var col = getRandomInt(0, cols - 1);
    var currCell = gBoard[row][col];
    if (currCell.isMine === true) {
      i--;
    } else {
      currCell.isMine = true;
    }
  }
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++)
      countNeighborMines(i, j, gBoard)
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
  let strHTML = `<table><tbody>`
  for (let i = 0; i < gLevel.ROWS; i++) {
    strHTML += `<tr>`;
    for (let j = 0; j < gLevel.COLS; j++) {
      const cell = gBoard[i][j];
      let className = 'cell';

      if (cell.isShown) {
        className += cell.isMine ? ' mine cell-revealed' : ' cell-revealed empty';
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
    elGrid.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    })
  } else {
    console.error('Grid container not found.');
  }

  const elLivesCounter = document.querySelector('.lives');
  if (elLivesCounter) {
    elLivesCounter.textContent = `${gGame.lives} Lives Left`;
    // console.log(elLivesCounter)
    // elLivesCounter.textContent = `${gGame.lives} Lives Left`
  }
}

function countNeighborMines(cellI, cellJ, board) {
  var mineCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i < 0 || j < 0 || i >= board.length || j >= board[i].length || (i === cellI && j === cellJ)) continue;
      if (board[i][j].isMine) mineCount++;
    }
  }
  board[cellI][cellJ].minesAroundCount = mineCount;
}

function revealCell(board, i, j) {
  var currCell = board[i][j];
  if (currCell.isShown || currCell.isMarked) return;

  currCell.isShown = true;
  gGame.shownCount++;

  renderBoard();
}

function revealBombs() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j];
      if (currCell.isMine || currCell.isShown) {
        currCell.isShown = true;
      }
    }
  }
  renderBoard();
}

function setLevel(level) {
  gLevel = level;
  console.log('glevel', gLevel);
  restartGame(level);
}

function checkGameOver() {
  const totalCells = gLevel.ROWS * gLevel.COLS;
  const nonMineCells = totalCells - gLevel.MINES;
  const allMinesMarked = gGame.markedCount === gLevel.MINES;

  if (gGame.shownCount === nonMineCells && allMinesMarked) {
    gGame.isOn = false;
    showGameOverEmojis(true);
  }
}

function showGameOverEmojis(isWin) {
  const restartBtn = document.querySelector('.restart-Btn');
  const livesCounter = document.querySelector('.lives');
  const victoryMsg = document.querySelector('.victory');

  if (isWin) {
    restartBtn.textContent = '😎';
    victoryMsg.style.opacity = 1; // Change here
    setTimeout(() => {
      victoryMsg.style.opacity = 0;
    }, 5000);
  } else {
    restartBtn.textContent = '🤯';
    livesCounter.textContent = `${gGame.lives} Lives Left`;
    livesCounter.style.color = 'initial';
  }
}
function resetBtn() {
  const restartBtn = document.querySelector('.restart-Btn');
  restartBtn.textContent = '😃'
}



function getRandomInt(min, max) {
  var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}
