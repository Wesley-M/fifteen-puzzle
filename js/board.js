// Representation of the game board
function Board() {
  var pieces = [];
  var moves = 0;
  var correct_pieces = 0;
  var elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  var complete_game = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,undefined]];

  // Coordinates of the blank space
  var empty_x = 3;
  var empty_y = 3;

  /* Shuffle the game's pieces */
  var shuffle_pieces = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  var generate_empty_board = function () {
    for (var i=0; i<board_length; i++) {
        pieces[i] = []
        for (var j=0; j<board_length; j++){
          pieces[i].push(0);
        }
    }
  }

  /* Test if a given piece is right where it belongs */
  var is_correct_position = function (piece) {
    if (piece == empty_x*board_length + empty_y + 1){
      positive_sound.play();
    } else {
      move_sound.play();
    }
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
      if (board_length % 2 != 0){
        return (invCount % 2 == 0);
      } else { // grid is even
          var pos = empty_x;
          if (pos % 2 != 0)
              return (invCount % 2 == 0);
          else
              return (invCount % 2 != 0);
      }
  }

  /* Return true if a board is completed */
  var is_solved = function () {
    var countCorrectPieces = 0;
    for (var i=0; i<board_length; i++){
      for (var j=0; j<board_length; j++){
        if (complete_game[i][j] === pieces[i][j]){
          countCorrectPieces++;
          if (countCorrectPieces === (board_length*board_length)-1)
            return true;
        }
      }
    }
    return false;
  }

  var restartNumberOfMoves = function () {
    moves = 0;
  }

  /* Initiate the board */
  this.init = function () {
    if (typeof clock === 'undefined'){
      clock = new Timer("#timer");
    } else {
      clock.restart();
    }

    empty_x = 3;
    empty_y = 3;

    restartNumberOfMoves();
    generate_empty_board();
    this.populate();

    clock.init();
    clock.execute();
  }

  /* Populate the board */
  this.populate = function () {
    // Generate shuffled elements until get a combination that is solvable
    var shuffled_elements = shuffle_pieces(elements);
    while (!(is_solvable(shuffled_elements))) {
      var shuffled_elements = shuffle_pieces(elements);
    }

    var index_shuffle = 0;

    for(var i=0; i<board_length; i++) {
        for (var j=0; j<board_length; j++){
          pieces[i][j] = shuffled_elements[index_shuffle];
          index_shuffle++;
        }
    }

  }

  this.getBoard = function () {
    return pieces.slice();
  }

  this.getNumberOfMoves = function () {
    return moves;
  }

  this.drawBoard = function () {
    if (is_solved()){
      congratulate();
      this.init();
    }

    correct_pieces = 0;
    $("table").empty();
    for (var i=0; i<board_length; i++){
      $("table").append("<tr></tr>");
      for (var j=0; j<board_length; j++){
        if (pieces[i][j] != undefined){
          if (pieces[i][j] != complete_game[i][j]){
            $("table tr:last").append("<td>" + pieces[i][j] + "</td>");
          }else{
            $("table tr:last").append("<td class='correct-cell'>" + pieces[i][j] + "</td>");
            correct_pieces++;
          }
        }else{
          $("table tr:last").append("<td style='visibility:hidden'></td>");
        }
      }
    }

    $("#number-of-moves").text("MOVES: " + moves);
    $("#progress-bar").css("backgroundPosition", Math.floor((correct_pieces/15)*100)+"%");
    $("#progress-bar p").text(Math.floor((correct_pieces/15)*100)+"%");

    $("#board-container").css("display", "block");
  }

  this.movePiece = function (_type) {
    switch (_type) {
      case "up":
        if (empty_x != 3){
          pieces[empty_x][empty_y] = pieces[empty_x+1][empty_y];
          pieces[empty_x+1][empty_y] = undefined;
          is_correct_position(pieces[empty_x][empty_y]);
          empty_x++;
          moves++;
        }
        break;
      case "down":
        if (empty_x != 0){
          pieces[empty_x][empty_y] = pieces[empty_x-1][empty_y];
          pieces[empty_x-1][empty_y] = undefined;
          is_correct_position(pieces[empty_x][empty_y]);
          empty_x--;
          moves++;
        }
        break;
      case "left":
        if (empty_y != 3){
          pieces[empty_x][empty_y] = pieces[empty_x][empty_y+1];
          pieces[empty_x][empty_y+1] = undefined;
          is_correct_position(pieces[empty_x][empty_y]);
          empty_y++;
          moves++;
        }
        break;
      case "right":
        if (empty_y != 0){
          pieces[empty_x][empty_y] = pieces[empty_x][empty_y-1];
          pieces[empty_x][empty_y-1] = undefined;
          is_correct_position(pieces[empty_x][empty_y]);
          empty_y--;
          moves++;
        }
    }

    this.drawBoard();

  }
}
