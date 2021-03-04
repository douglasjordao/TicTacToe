export default class Game {
    constructor(player, ai) {
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        this.player = player;
        this.ai = ai;
        this.activePlayer = 0;
    }

    startGame() {
        resetGame(this.board);
        this.activePlayer = (this.activePlayer + 1) % 2;
    }

    placeMark(target) {
        if (!gameOver(this.board)) {
            if (!target.classList.contains(this.player.mark) && !target.classList.contains(this.ai.mark)) {

                //Player Move
                if (gameOver(this.board)) {
                    declareWinner(this.board, this.player, this.ai);
                    return;
                } else if (this.activePlayer == 1) {
                    this.player.makeMove(target, this.board);
                    this.activePlayer = 0;
                }

                //Ai Move
                if (gameOver(this.board)) {
                    declareWinner(this.board, this.player, this.ai);
                    return;
                } else if (this.activePlayer == 0) {
                    this.ai.makeMove(this.board, this.activePlayer);
                    this.activePlayer = 1;
                }

                //Check if there's a winner
                if (gameOver(this.board)) {
                    declareWinner(this.board, this.player, this.ai);
                    return;
                }

            }
        }
    }

    getWinnerMark(board) {
        return checkWinner(board);
    }
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

function declareWinner(board, player, ai) {

    let winner = checkWinner(board);
    if (winner == "X") {
        $('#title')[0].innerHTML = `<img class="small-mark-x" src="src/img/x.png">` + " É o vencedor!";
        ai.score++;
    } else if (winner == "O") {
        $('#title')[0].innerHTML = `<img class="small-mark-o" src="src/img/o.png"></img>` + " É o vencedor!";
        player.score++;
    } else if (winner == "Draw") {
        $('#title')[0].innerHTML = "Deu velha!";
    }
    $('#score-o')[0].innerHTML = player.score;
    $('#score-x')[0].innerHTML = ai.score;

    createRestartButton(board);
}

function createRestartButton(board) {
    $('#reset-btn-div')[0].innerHTML = `<button id="reset-btn" type="button" class="btn btn-outline-dark btn-lg">De novo!</button>`;
    $('#reset-btn').click(function (e) {
        resetGame(board);
    });
}

function resetGame(board) {

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

function gameOver(board) {
    if (checkWinner(board) != null) {
        return true;
    }
    return false;
}
