import Game from "./Game.js";

export default class Ai {
    constructor() {
        this.mark = "xMark";
        this.score = 0;
    }

    makeMove(board, activePlayer) {
        let cells = $('.cell');
        let pos = calculateMove(board, activePlayer);
        let cellId = pos.join("-");

        board[pos[0]][pos[1]] = "X";

        for (let i = 0; i < 9; i++) {
            if (cells[i].id == cellId) {
                cells[i].className += " " + this.mark;
            }
        }
    }
}

var game = new Game();
var scoreRef = {
    "O": -1,
    "X": 1,
    "Draw": 0
};

function calculateMove(board, activePlayer) {
    let blankCells = getBlankCells(board);
    let player = activePlayer;
    let bestScore = -Infinity;
    let bestMove = [];
    let score;

    blankCells.forEach(pos => {
        board[pos.i][pos.j] = "X";
        score = minimax(board, player);
        board[pos.i][pos.j] = "";

        if (score > bestScore) {
            bestScore = score;
            bestMove[0] = pos.i;
            bestMove[1] = pos.j;
        }
    });

    return bestMove;
}

function minimax(board, player) {
    let blankCells = getBlankCells(board);
    let bestScore = -Infinity;
    let score;

    //change active player
    player = (player + 1) % 2;

    if (game.getWinnerMark(board) != null) {
        return scoreRef[game.getWinnerMark(board)];
    }

    blankCells.forEach(pos => {

        if (player == 1) {
            board[pos.i][pos.j] = "O";
        } else {
            board[pos.i][pos.j] = "X";
        }

        score = minimax(board, player);
        board[pos.i][pos.j] = "";

        if (bestScore == -Infinity) {
            bestScore = score;
        }
        if (player == 1) {
            if (score < bestScore) {
                bestScore = score;
            }
        } else {
            if (score > bestScore) {
                bestScore = score;
            }
        }
    });

    return bestScore;
}

function getBlankCells(board) {
    let blankCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                blankCells.push({ i, j });
            }
        }
    }
    return blankCells;
}