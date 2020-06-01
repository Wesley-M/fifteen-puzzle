import Board from './Board.js'
import Timer from '../components/Timer.js'
import Sound from '../components/Sound.js'

import { BOARD_LENGTH, SOUND_DIR, KEYS_TO_DIRECTIONS, EVENTS_TO_DIRECTIONS } from '../../config/settings.js'

export default class Game {

  constructor() {
    this.self = this;
    this.board = new Board();
    this.timer = new Timer("#timer");
    this.score = 9999;
    this.correctPieces = 0;
    this.scorePenalty = this.score * 0.005;
    this.showingWinScreen = false;

    this.init();
  }

  init() {
    this.initEvents();
    this.initSounds();
  }

  initEvents() {
    this.restartEvent();
    this.musicButtonEvents();
    this.keyEvents();
    this.touchEvents();
  }

  initSounds() {
    this.sounds = {
      "background":   new Sound(SOUND_DIR + "background.ogg", 0.6, true),
      "move":         new Sound(SOUND_DIR + "move.wav", 0.2),
      "correctPiece": new Sound(SOUND_DIR + "correctPiece.wav", 0.1),
      "restart":      new Sound(SOUND_DIR + "restart.ogg", 0.6),
      "winOne":       new Sound(SOUND_DIR + "winOne.ogg", 0.6),
      "winTwo":       new Sound(SOUND_DIR + "winTwo.wav", 0.6),
    };
  }

  restartEvent() {
    // Handle click in restart button
    document.querySelector("#restart-btn").addEventListener('click', () => {
      this.sounds["restart"].play();
      this.play();
    });
  }

  musicButtonEvents() {
    // handle click in toggle sound button
    document.querySelector("#music-off, #music-on").addEventListener('click', () => {
      this.sounds["background"].toggle();
    });
  }

  keyEvents() {
    // Handle the arrow keys
    document.onkeydown = (e) => {
      var keyCode = e.keyCode;
      if (keyCode in KEYS_TO_DIRECTIONS) {
        this._move(KEYS_TO_DIRECTIONS[keyCode]);
        this.render();
      }
    };
  }

  touchEvents() {
    // Handle hammer events
    var hammertime = new Hammer(document.body);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on("swipeleft swiperight swipeup swipedown", (ev) => {
      var typeOfEvent = ev.type;
      if (typeOfEvent in EVENTS_TO_DIRECTIONS) {
        this._move(EVENTS_TO_DIRECTIONS[typeOfEvent]);
        this.render();
      }
    });
  }

  play() {
    this.board.init();
    this.timer.reset();
    this.render();
  }

  _move(direction) {
    if (!this.timer.running) this.timer.start();
    if(this.board.movePiece(direction)) {
      this.sounds["correctPiece"].play();
    } else {
      this.sounds["move"].play();
      this.score -= this.scorePenalty;
    }
  }

  render() {
    if (this.board.isSolved()) this.congratulate();

    this.renderBoard();
    this.renderStatistics();
  }

  renderBoard() {
    let board = this.board.pieces;
    
    // Selecting the table
    let table = document.querySelector("table");

    // Cleaning the table
    table.innerHTML = "";

    // Setting objects structures
    let tr = "<tr></tr>";
    let incorrectPiece = "<td>PIECE_VALUE</td>"
    let hiddenPiece = "<td style='visibility:hidden'></td>";
    let correctPiece = "<td class='correct-cell'>PIECE_VALUE</td>";

    // Reseting the correct pieces counter
    this.correctPieces = 0;

    board.forEach(row => {
      // Rendering the rows
      table.innerHTML += tr;
      let lastTR = document.querySelector("table tr:last-child");
      
      // Rendering the pieces
      row.forEach(piece => {
        if (piece != undefined) {
            if (this.board.isCorrectPosition(piece)) {
              lastTR.innerHTML += correctPiece.replace("PIECE_VALUE", piece); 
              this.correctPieces += 1;
            } else {
              lastTR.innerHTML += incorrectPiece.replace("PIECE_VALUE", piece);
            }
        } else {
          lastTR.innerHTML += hiddenPiece;
        }
      })
    });
  }

  renderStatistics() {
    let percentageOfCorrectMoves = Math.floor((this.correctPieces/(BOARD_LENGTH*BOARD_LENGTH - 1))*100)

    document.querySelector("#number-of-moves").innerText = `MOVES: ${this.board.moves}`;
    document.querySelector("#progress-bar").style.backgroundPosition = percentageOfCorrectMoves + "%";
    document.querySelector("#progress-bar p").innerText = percentageOfCorrectMoves + "%";

    if (!this.showingWinScreen) document.querySelector("#game-board").display = "block";
  }


  congratulate() {
    this.sounds["winOne"].play();
    this.sounds["winTwo"].play();

    document.querySelector("#game-board").display = "none";
    document.querySelector("#congratulations-container").display = "block";

    document.querySelector("#stats-moves").innerText = `Moves: ${this.board.moves}`;
    document.querySelector("#stats-timer").innerText = `Time: ${this.timer.time}`;

    this.showingWinScreen = true;

    document.querySelector("#trophy-img").addEventListener("click", () => {
      document.querySelector("#game-board").display = "block";
      document.querySelector("#congratulations-container").display = "none";
      this.showingWinScreen = false;
    });

    this.timer.reset();
    this.board.init();
  }

}
