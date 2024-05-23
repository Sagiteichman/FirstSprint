'use strict'

// function createMat(rows, cols) {
//     const mat = []
//     for (var i = 0; i < rows; i++) {
//         const row = []
//         for (var j = 0; j < cols; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }
// function getRandomInt(min, max) {
//   var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
//   return randomNum;
// }

// function findEmptyPos() {
//     //emptyPoss will be [{i:0,j:0},{i:0,j:1}]
//     var emptyPoss = []
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard.length; j++) {
//             var cell = gBoard[i][j]
//             if (!cell) {
//                 // console.log('cell:', cell)
//                 var pos = { i: i, j: j }
//                 emptyPoss.push(pos)
//             }
//         }
//     }
//     var randIdx = getRandomInt(0, emptyPoss.length) // 0 , 1
//     var randPos = emptyPoss[randIdx] //{}
//     return randPos
// }

// function copyMat(mat) {
//     var newMat = []
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = []
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j]
//         }
//     }
//     return newMat
// }

// function countAround(cellI, cellJ) { // 7,0
//     var aroundCount = 0
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue
//             if (i === cellI && j === cellJ) continue

//             if (gBoard[i][j] === LIFE) aroundCount++
//         }
//     }
//     return aroundCount
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// function makeId(length = 6) {
//     var txt = ''
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length))
//     }

//     return txt
// }
// function printPrimaryDiagonal(squareMat) {
//     for (var d = 0; d < squareMat.length; d++) {
//         var item = squareMat[d][d]
//         console.log(item)
//     }
// }
// function printSecondaryDiagonal(squareMat) {
//     for (var d = 0; d < squareMat.length; d++) {
//         var item = squareMat[d][squareMat.length - d - 1]
//         console.log(item)
//     }
// }