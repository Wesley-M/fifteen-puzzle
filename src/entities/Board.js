import { BOARD_LENGTH, MOVE_TO } from '../../config/settings.js'

class Pair {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default class Board {
  constructor() {
    this.pieces = this.emptyBoard();
    this.moves = 0;
    this.blank = new Pair(BOARD_LENGTH - 1, BOARD_LENGTH - 1);
  }

  init() {
    this.blank.x = BOARD_LENGTH - 1;
    this.blank.y = BOARD_LENGTH - 1;
    this.moves = 0;
    this.emptyBoard();
    this.fillBoard();
  }

  /**
  * Randomize array element order in-place.
  * Using Durstenfeld shuffle algorithm.
  */
  _shufflePieces(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  isCorrectPosition(piece) {
    let correctX, correctY;
    correctX = Math.ceil(piece / BOARD_LENGTH) - 1;
    if (piece % BOARD_LENGTH == 0) {
      correctY = BOARD_LENGTH - 1;
    } else {
      correctY = piece % BOARD_LENGTH - 1;
    }
    return piece == this.pieces[correctX][correctY];
  }

  _numberOfInversions(pieces) {
    var invCount = 0;
    for (var i = 0; i < pieces.length - 1; i++) {
      for (var j = i + 1; j < pieces.length; j++) {
        if (pieces[i] > pieces[j]) invCount++;
      }
    }
    return invCount;
  }

  _isSolvable(pieces) {
    let invCount = this._numberOfInversions(pieces);
    if (BOARD_LENGTH % 2 != 0) {
      return (invCount % 2 == 0);
    } else {
      var pos = this.blank.x;
      return (pos % 2 != 0) ? (invCount % 2 == 0) : (invCount % 2 != 0);
    }
  }

  isSolved() {
    let correct_pieces = 0;
    for (var i = 0; i < BOARD_LENGTH; i++) {
      for (var j = 0; j < BOARD_LENGTH; j++) {
        if (this.pieces[i][j] != undefined) {
          if (this.isCorrectPosition(this.pieces[i][j])) correct_pieces++;
        }
      }
    }
    return (correct_pieces == Math.pow(BOARD_LENGTH, 2) - 1);
  }

  _generatePieces(number) {
    let pieces = [];
    for (let i = 1; i <= number; i++) pieces.push(i);
    return pieces;
  }

  emptyBoard() {
    return new Array(BOARD_LENGTH).fill(0)
                .map(() => new Array(BOARD_LENGTH).fill(0));
  }

  fillBoard() {
    // Test if current configuration of pieces is solvable.
    var shuffledPieces = [];
    do {
      shuffledPieces = this._shufflePieces(
        this._generatePieces(BOARD_LENGTH * BOARD_LENGTH-1));
    } while (!(this._isSolvable(shuffledPieces)));
    // Populate board
    for(let i = 0; i < BOARD_LENGTH; i++) {
      for (let j = 0; j < BOARD_LENGTH; j++) {
        this.pieces[i][j] = shuffledPieces[BOARD_LENGTH * i + j];
      }
    }
  }

  movePiece(direction) {
    let changes = MOVE_TO[direction];
    let newX;
    let newY;
    let happened = false;
    let isCorrect = false;

    if (!(this.blank.x != changes["limit_x"] && this.blank.y != changes["limit_y"])) {
      return {happened, isCorrect};
    }

    if (changes["change_x"] != undefined) {
      newX = this.blank.x + changes["change_x"];
    } else {
      newX = this.blank.x;
    }

    if (changes["change_y"] != undefined) {
      newY = this.blank.y + changes["change_y"];
    } else {
      newY = this.blank.y;
    }

    this.pieces[this.blank.x][this.blank.y] = this.pieces[newX][newY];
    this.pieces[newX][newY] = undefined;

    isCorrect = this.isCorrectPosition(this.pieces[this.blank.x][this.blank.y]);

    this.blank.x = newX;
    this.blank.y = newY;
    this.moves++;

    happened = true;

    return { happened, isCorrect };
  }
}
