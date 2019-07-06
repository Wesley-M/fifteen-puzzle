// Representation of the game board
function Board() {

  var pieces = [];
  var moves = 0;
  var elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Coordinates of the blank space
  var emptyX = BOARD_LENGTH - 1;
  var emptyY = BOARD_LENGTH - 1;

  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */
  var shuffle_pieces = function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }

  var generate_empty_board = function () {
    for (var i=0; i < BOARD_LENGTH; i++) {
        pieces[i] = []
        for (var j=0; j < BOARD_LENGTH; j++){
          pieces[i].push(0);
        }
    }
  }

  /* Test if a given piece is right where it belongs */
  this.isCorrectPosition = function (piece) {
    let correctX = Math.ceil(piece/BOARD_LENGTH) - 1;
    let correctY = (piece%BOARD_LENGTH == 0) ? BOARD_LENGTH - 1 : piece%BOARD_LENGTH - 1;
    return (piece == pieces[correctX][correctY]);
  }

  /* Return the number of inversions in a board, it's used for
  determining whether a board is solvable or not */
  var get_inversion_count = function (pieces_in_line) {
      var inv_count = 0;
      for (var i = 0; i < pieces_in_line.length - 1; i++) {
          for (var j = i + 1; j < pieces_in_line.length; j++) {
              // count pairs(i, j) such that i appears
              // before j, but i > j.
              if (pieces_in_line[i] > pieces_in_line[j]){
                inv_count++;
              }
          }
      }
      return inv_count;
  }

  /* Return true if a generated board is solvable */
  var is_solvable = function (pieces_in_line) {
      // Count inversions in given board
      invCount = get_inversion_count(pieces_in_line);

      // If grid is odd, return true if inversion
      // count is even.
      if (BOARD_LENGTH % 2 != 0){
        return (invCount % 2 == 0);
      } else { // grid is even
          var pos = emptyX;
          if (pos % 2 != 0)
              return (invCount % 2 == 0);
          else
              return (invCount % 2 != 0);
      }
  }

  /* Return true if a board is completed */
  this.isSolved = function () {
    correct_pieces = 0;
    for (var i = 0; i < BOARD_LENGTH; i++) {
      for (var j = 0; j < BOARD_LENGTH; j++) {
        if (pieces[i][j] != undefined) {
          if (this.isCorrectPosition(pieces[i][j])){
            correct_pieces++;
          }
        }
      }
    }
    return (correct_pieces == Math.pow(BOARD_LENGTH, 2) - 1);
  }

  var restartNumberOfMoves = function () {
    moves = 0;
  }

  this.getMoves = function () {
    return moves;
  }

  /* Initiate the board */
  this.init = function () {
    if (typeof clock === "undefined"){
      clock = new Timer("#timer");
      clock.init();
      clock.execute();
    } else {
      clock.restart();
    }

    emptyX = 3;
    emptyY = 3;

    restartNumberOfMoves();
    generate_empty_board();
    this.populate();
  }

  /* Populate the board */
  this.populate = function () {
    // Generate shuffled elements until get a combination that is solvable
    var shuffled_elements = shuffle_pieces(elements);

    while (!(is_solvable(shuffled_elements))) {
      var shuffled_elements = shuffle_pieces(elements);
    }

    var index_shuffle = 0;

    for(var i=0; i < BOARD_LENGTH; i++) {
        for (var j=0; j < BOARD_LENGTH; j++) {
          pieces[i][j] = shuffled_elements[index_shuffle];
          index_shuffle++;
        }
    }

  }

  this.getPieces = function () {
    return pieces.slice();
  }

  this.getNumberOfMoves = function () {
    return moves;
  }

  this.move = function (type) {
    movesInfo = moveTo[type];
    if (emptyX != movesInfo["limit_x"] && emptyY != movesInfo["limit_y"]) {
      new_x = (movesInfo["change_x"] != undefined) ? emptyX + movesInfo["change_x"] : emptyX;
      new_y = (movesInfo["change_y"] != undefined) ? emptyY + movesInfo["change_y"] : emptyY;

      pieces[emptyX][emptyY] = pieces[new_x][new_y];
      pieces[new_x][new_y] = undefined;

      if (this.isCorrectPosition(pieces[emptyX][emptyY])) {
        POSITIVE_SOUND.play();
      } else {
        MOVE_SOUND.play();
      }

      emptyX = new_x;
      emptyY = new_y;

      moves++;
    }
  }
}
