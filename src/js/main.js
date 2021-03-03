import Game from "./Game.js";

//0 = AI, 1 = Player
var activePlayer = 1;
var scoreO = 0;
var scoreX = 0;
var playerMark = " oMark";
var aiMark = " xMark";
var scoreRef = {
    "O": -1,
    "X": 1,
    "Draw": 0
};
var game = new Game();

$('.cell').on('click', function (event) {
    placeMark(event.target, game.board, activePlayer)
});

startGame(game.board);

function startGame(board) {

    activePlayer = 1;
    let cells = $('.cell');
    cells.each(function () {
        $(this)[0].className = "cell";
    });

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
        }
    }
    $('#title')[0].innerHTML = "Jogo da Velha";
    $('#reset-btn-div')[0].innerHTML = "";

}

function placeMark(target, board, activePlayer) {
    if (!target.classList.contains('o-img-mark') && !target.classList.contains('-img-mark')) {
        if (target.innerHTML != aiMark && target.innerHTML != playerMark) {
            //Player Move
            if (gameOver(board)) {
                declareWinner(board);
                return;
            } else if (activePlayer == 1) {
                let pos = target.id.split("-");
                if (board[pos[0]][pos[1]] != "X") {
                    board[pos[0]][pos[1]] = "O";
                    target.className += playerMark;
                    activePlayer = 0;
                }
            }

            //Ai Move
            if (gameOver(board)) {
                declareWinner(board);
                return;
            } else if (activePlayer == 0) {
                aiMakeMove(board, activePlayer);
                activePlayer = 1;
            }

            //Check if there's a winner
            if (gameOver(board)) {
                declareWinner(board);
                return;
            }
        }
    }
}

function gameOver(board) {
    if (checkWinner(board) != null) {
        return true;
    }
    return false;
}

function declareWinner(board) {
    let winner = checkWinner(board);
    if (winner == "X") {
        $('#title')[0].innerHTML = `<img class="small-mark-x" src="src/img/x.png">` + " É o vencedor!";
        scoreX++;
    } else if (winner == "O") {
        $('#title')[0].innerHTML = `<img class="small-mark-o" src="src/img/o.png"></img>` + " É o vencedor!";
        scoreO++;
    } else if (winner == "Draw") {
        $('#title')[0].innerHTML = "Deu velha!";
    }
    $('#score-o')[0].innerHTML = scoreO;
    $('#score-x')[0].innerHTML = scoreX;

    createRestartButton(board);
}

function createRestartButton(board) {
    $('#reset-btn-div')[0].innerHTML = `<button id="reset-btn" type="button" class="btn btn-outline-dark btn-lg">De novo!</button>`;
    $('#reset-btn').click(function (e) {
        startGame(board);
    });
}

function aiMakeMove(board, activePlayer) {
    let cells = $('.cell');
    let pos = aiCalculateMove(board, activePlayer);
    let cellId = pos.join("-");

    board[pos[0]][pos[1]] = "X";

    for (let i = 0; i < 9; i++) {
        if (cells[i].id == cellId) {
            cells[i].className += aiMark;
        }
    }
}

function aiCalculateMove(board, activePlayer) {
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

    if (checkWinner(board) != null) {
        return scoreRef[checkWinner(board)];
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

function checkWinner(board) {
    //Horizontal
    for (let i = 0; i < 3; i++) {
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != "") {
            return board[i][0];
        }
    }

    //vertical
    for (let j = 0; j < 3; j++) {
        if (board[0][j] == board[1][j] && board[1][j] == board[2][j] && board[0][j] != "") {
            return board[0][j];
        }
    }

    //Diagonal
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != "") {
        return board[0][0];
    }
    if (board[2][0] == board[1][1] && board[1][1] == board[0][2] && board[2][0] != "") {
        return board[2][0];
    }

    //Draw
    if (getBlankCells(board).length == 0) {
        return "Draw";
    }

    return null;
}