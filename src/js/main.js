import Ai from "./Ai.js";
import Game from "./Game.js";
import Player from "./Player.js";

var player = new Player();
var ai = new Ai();
var game = new Game(player, ai);


$('.cell').on('click', function (event) {
    game.placeMark(event.target)
});

game.startGame();