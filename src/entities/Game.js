import Board from './Board.js'
import Timer from '../components/Timer.js'
import Sound from '../components/Sound.js'

import { SOUND_DIR, KEYS_TO_DIRECTIONS, EVENTS_TO_DIRECTIONS } from '../../config/settings.js'

export default class Game {

  constructor() {
    this.self = this;
    this.board = new Board();
    this.timer = new Timer("#timer");
    this.score = 9999;
    this.scoreMovePenalty = this.score * 0.001;
    this.scoreTimePenaulty = this.scoreMovePenalty / 3;
    this.scoreWidget = document.querySelector("score-widget");
    this.correctPieces = 0;
    this.showingWinScreen = false;

    this.init();
  }

  init() {
    this.initEvents();
    this.initSounds();
    this.updateScore();
    this.initContinuousScoreDecrease();
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
        this.move(KEYS_TO_DIRECTIONS[keyCode]);
        if (!this.checkWin()) this.updateScore(true, this.scoreMovePenalty);
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
        this.move(EVENTS_TO_DIRECTIONS[typeOfEvent]);
        if (!this.checkWin()) this.updateScore(true, this.scoreMovePenalty);
      }
    });
  }

  updateScore(decrease, penalty) {
    let newScore = parseInt(this.score - penalty);

    if (decrease && newScore >= 0) this.score = newScore;
    else if (newScore < 0) this.score = 0;
    
    this.scoreWidget.setAttribute('score', this.score);
  }

  initContinuousScoreDecrease() {
    this.continuousDecreaseId = setInterval(() => {
      this.updateScore(true, this.scoreTimePenaulty);
    }, 1000);
  }

  play() {
    this.board.init();
    this.timer.reset();
    this.checkWin();
  }

  move(direction) {
    if (!this.timer.running) this.timer.start();
    if(this.board.movePiece(direction)) {
      this.sounds["correctPiece"].play();
    } else {
      this.sounds["move"].play();
    }
  }

  checkWin() {
    let won = this.board.isSolved();
    if (won) { 
      this.congratulate();
      clearInterval(this.continuousDecreaseId);
    }
    return won;
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
