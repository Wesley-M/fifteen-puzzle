class Game {

  constructor() {
    this.board = new Board();
    this.timer = new Timer("#timer");
    this.self = this;
    this.showingWinScreen = false;
  }

  play() {
    this.initEvents();
    this.board.init();
    this.timer.reset();
    this.render();
  }

  restart() {
    RESTART_SOUND.play();
    this.board.init();
    this.timer.reset();
    this.render();
  }

  initEvents() {
    // Handle click in restart button
    $("#restart-btn").click(() => {
      this.restart();
    });

    // handle click in toggle sound button
    $("#music-off, #music-on").click(function(){
      SOUNDS["background"].toggle();
      $("#music-off, #music-on").toggle();
    });

    // Handle the arrow keys
    document.onkeydown = (e) => {
      var keyCode = e.keyCode;
      if (keyCode in KEYS_MOVES) {
        if (!this.timer.running) this.timer.start();
        this.board.movePiece(KEYS_MOVES[keyCode]);
        this.render();
      }
    };

    // Handle hammer events
    var hammertime = new Hammer(document.body);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on("swipeleft swiperight swipeup swipedown", (ev) => {
      var typeOfEvent = ev.type;
      if (typeOfEvent in EVENTS_MOVES) {
        if (!this.timer.running) this.timer.start();
        this.board.movePiece(EVENTS_MOVES[typeOfEvent]);
        this.render();
      }
    });
  }

  render() {
    if (this.board.isSolved()) this.congratulate();

    $("table").empty();
    var boardPieces = this.board.pieces;
    var correctPieces = 0;
    for (var i = 0; i < BOARD_LENGTH; i++) {
      $("table").append("<tr></tr>");
      for (var j = 0; j< BOARD_LENGTH; j++) {
        if (boardPieces[i][j] != undefined) {
          if (this.board.isCorrectPosition(
            boardPieces[i][j])) {
            $("table tr:last").append("<td class='correct-cell'>" + boardPieces[i][j] + "</td>");
            correctPieces++;
          } else {
            $("table tr:last").append("<td>" + boardPieces[i][j] + "</td>");
          }
        } else {
          $("table tr:last").append("<td style='visibility:hidden'></td>");
        }
      }
    }

    // Set statistics about the game
    // $("#number-of-moves").text("MOVES: " + this.board.getMoves());
    var percentageOfCorrectMoves = Math.floor((correctPieces/(BOARD_LENGTH*BOARD_LENGTH - 1))*100)
    $("#progress-bar").css("backgroundPosition", percentageOfCorrectMoves + "%");
    $("#progress-bar p").text(percentageOfCorrectMoves + "%");

    if (!this.showingWinScreen) $("#game-board").show();
  }

  congratulate() {
    this.timer.reset();
    SOUNDS["winOne"].play();
    SOUNDS["winTwo"].play();
    $("#game-board").hide();
    $("#congratulations-container").show();
    $("#stats-moves").text("Number of moves: " + this.board.getNumberOfMoves());
    $("#stats-timer").text("Time: " + this.timer.time);
    this.showingWinScreen = true;
    setTimeout (function () {
      $("#game-board").show();
      $("#congratulations-container").hide();
      this.showingWinScreen = false;
    }, 2000);
    this.board.init();
  }
}
