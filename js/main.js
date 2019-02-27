const board_length = 4;

/* Here is defined the sound object, which has options
of play, stop or loop a song. */

function Sound(src, vol) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.volume = vol;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.status = false;
    document.body.appendChild(this.sound);

    this.play = function(){
        this.sound.play();
        this.status = true;
    }
    this.stop = function(){
        this.sound.pause();
        this.status = false;
    }
    this.loop = function (type) {
      this.sound.loop = type;
    }
    this.toggle = function () {
      if (this.status)
        this.stop();
      else {
        this.play();
      }
    }
}

// Load and set all the sounds needed
background_sound = new Sound("snd/creepy.mp3", 1);
background_sound.loop(true);

move_sound = new Sound("snd/neutral.wav", 0.5);
positive_sound = new Sound("snd/positive.wav", 0.2);

congratulations_sound = new Sound("snd/congratulations.ogg", 1);
win_sound = new Sound("snd/winning.wav", 1);

// Congratulate user that cleared the game
var congratulate = function () {
  background_sound.stop();
  win_sound.play();
  setTimeout(function(){ congratulations_sound.play(); }, 1500);

  $("body").append("<h1 id='congrats'>Congratulations!</h1>");

  // Wrap every letter in a span
  $('#congrats').each(function(){
    $(this).html($(this).text().replace(/([a-zA-Z]|\w|!)/g, "<span class='letter'>$&</span>"));
  });

  anime.timeline({loop: true})
    .add({
      targets: '#congrats .letter',
      scale: [4,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 950,
      delay: function(el, i) {
        return 70*i;
      }
    }).add({
      targets: '#congrats',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });

    setTimeout(function (){
      win_sound.stop();
      $("#congrats").remove();
    }, 5500);

    background_sound.play();
}

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
    empty_x = 3;
    empty_y = 3;
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

    $("table, #board-container, #header-board-container").remove();
    $("body").append("<div id='board-container'></div>");
    $("#board-container").append("<div id='header-board-container'> <span class='statistic'> MOVES: " + this.getNumberOfMoves() + "</span> </div>")
    $("#board-container").append("<table style='display:none'></table>");

    correct_pieces = 0;
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
    $("#header-board-container").append("<span class='statistic'> SUCCESS: " + Math.floor((correct_pieces/15)*100) + "%</span>");
    $("#board-container").append("<a id='options'> <img id='restart-btn' title='restart' src='img/restart.png'/> </a>");
    $("#board-container #options").append("<img id='no-sound-btn' title='no background sound' src='img/no_sound.png'/>");

    $("#restart-btn").click(function(){
      board.init();
      setTimeout(function(){ board.drawBoard(); }, 1000);
    });

    $("#no-sound-btn").click(function(){
      background_sound.toggle();
    });

    $("table").css("display", "block");
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

board = new Board();

// Listen to click on play button
$(document).ready(function(){
  $("#start-button").click(function(){
    $(this).add("#game-name").fadeOut();
    board.init();
    background_sound.play();
    setTimeout(function(){
      board.drawBoard();
    }, 300);
  });
});

// Listen to arrow keys
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: // Left
            board.movePiece("left");
            break;
        case 38: // Up
            board.movePiece("up");
            break;
        case 39: // Right
            board.movePiece("right");
            break;
        case 40: // Down
            board.movePiece("down");
            break;
    }
};

body = document.body;
var hammertime = new Hammer(body);
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

hammertime.on("swipeleft swiperight swipeup swipedown", function(ev) {
	switch(ev.type){
    case "swipeleft": // Left
        board.movePiece("left");
        break;
    case "swipeup": // Up
        board.movePiece("up");
        break;
    case "swiperight": // Right
        board.movePiece("right");
        break;
    case "swipedown": // Down
        board.movePiece("down");
        break;
  }
});
