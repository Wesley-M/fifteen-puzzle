function Game() {

  var board = new Board();
  var timer = new Timer("#timer");

  var self = this;

  this.play = function () {
    this.initEvents();
    board.init();
    timer.reset();
    this.renderBoard();
  }

  this.restart = function () {
    RESTART_SOUND.play();
    board.init();
    timer.reset();
    setTimeout(function(){ self.renderBoard(); }, 300);
  }

  this.initEvents = function() {

    // Handle click in restart button
    $("#restart-btn").click(function(){
      self.restart();
    });

    // handle click in toggle sound button
    $("#music-off, #music-on").click(function(){
      BACKGROUND_SOUND.toggle();
      $("#music-off, #music-on").toggle();
    });

    // Handle the arrow keys
    document.onkeydown = function(e) {
      keyCode = e.keyCode;
      if (keyCode in KEYS_MOVES) {
        if (!timer.isRunning()) timer.start();
        board.move(KEYS_MOVES[keyCode]);
        self.renderBoard();
      }
    };

    // Handle hammer events
    var hammertime = new Hammer(document.body);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on("swipeleft swiperight swipeup swipedown", function(ev) {
      typeOfEvent = ev.type;
      if (typeOfEvent in EVENTS_MOVES) {
        if (!timer.isRunning()) timer.start();
        board.move(EVENTS_MOVES[typeOfEvent]);
        self.renderBoard();
      }
    });
  }

  this.renderBoard = function() {

    if (board.isSolved()) {
      this.congratulate();
    }

    // Clean the old table
    $("table").empty();

    boardPieces = board.getPieces();
    correctPieces = 0;

    // Generate the new table
    for (var i=0; i < BOARD_LENGTH; i++) {
      $("table").append("<tr></tr>");
      for (var j=0; j< BOARD_LENGTH; j++) {
        if (boardPieces[i][j] != undefined) {
          if (board.isCorrectPosition(boardPieces[i][j])) {
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
    $("#number-of-moves").text("MOVES: " + board.getMoves());

    percentageOfCorrectMoves = Math.floor((correctPieces/(BOARD_LENGTH*BOARD_LENGTH - 1))*100)
    $("#progress-bar").css("backgroundPosition", percentageOfCorrectMoves + "%");
    $("#progress-bar p").text(percentageOfCorrectMoves + "%");

    $("#board-container").css("display", "block");
  }

  this.congratulate = function() {
    WIN_SOUND.play();
    setTimeout(function(){ CONGRATULATIONS_SOUND.play(); }, 1500);
    board.init();
  }

}
