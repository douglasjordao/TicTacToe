export default class Player {
    constructor() {
        this.mark = "oMark";
        this.score = 0;
    }

    makeMove(target, board) {
        
        let pos = target.id.split("-");
        if (board[pos[0]][pos[1]] != "X") {
            board[pos[0]][pos[1]] = "O";
            target.className += " " + this.mark;
        }
    }
}