import Board from './Board.js'
import Timer from '../components/Timer.js'
import Sound from '../components/Sound.js'

import { 
  SOUND_DIR, 
  MAX_SCORE, 
  KEYS_TO_DIRECTIONS, 
  EVENTS_TO_DIRECTIONS 
} from '../../config/settings.js'

export default class Game {

  constructor() {
    this.self = this;
    this.board = new Board();
    this.timer = new Timer("#timer");
    this.score = MAX_SCORE;
    this.scoreMovePenalty = this.score * 0.001;
    this.scoreTimePenaulty = this.scoreMovePenalty / 3;
    this.scoreWidget = document.querySelector("score-widget");
    this.correctPieces = 0;

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

  initContinuousScoreDecrease() {
    this.continuousDecreaseId = setInterval(() => {
      this.updateScore(true, this.scoreTimePenaulty);
    }, 1000);
  }

  updateScore(decrease, penalty) {
    let newScore = parseInt(this.score - penalty);

    if (decrease && newScore >= 0) this.score = newScore;
    else if (newScore < 0) this.score = 0;
    
    this.scoreWidget.setAttribute('score', this.score);
  }

  play() {
    this.board.init();
    this.timer.reset();
    this.checkWin();
  }

  move(direction) {
    if (!this.timer.running) this.timer.start();
    
    let move = this.board.movePiece(direction);

    if(move.happened) {
      if (move.isCorrect) this.sounds["correctPiece"].play();
      else this.sounds["move"].play();
    }

    return move.happened;
  }

  checkWin() {
    let won = this.board.isSolved();
    if (won) this.congratulate();
    return won;
  }

  congratulate() {
    this.sounds["winOne"].play();
    this.sounds["winTwo"].play();

    const gameId = this.scoreWidget.gameId;
    const score = this.scoreWidget.score;

    clearInterval(this.continuousDecreaseId);

    this.getWinnerName().then(response => {
      this.saveScore(gameId, response.value, score);
    });

    this.timer.reset();
    this.board.init();
    this.scoreWidget.score = MAX_SCORE;
  }

  async getWinnerName() {
    return await Swal.fire({
      title: 'You Win!',
      text: 'Please enter your name: ',
      input: 'text',
      showCancelButton: true,
      customClass: {
        input: 'winner-name'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    });
  }

  async saveScore(gameId, name, score) {
    const response = await fetch("https://wgames-server.herokuapp.com/scores", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameId: gameId, 
        name: name, 
        value: score
      })
    });

    return response.json(); // parses JSON response into native JavaScript objects
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
        let moveHappened = this.move(KEYS_TO_DIRECTIONS[keyCode]);
        if (!this.checkWin() && moveHappened) this.updateScore(true, this.scoreMovePenalty);
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
        let moveHappened = this.move(EVENTS_TO_DIRECTIONS[typeOfEvent]);
        if (!this.checkWin() && moveHappened) this.updateScore(true, this.scoreMovePenalty);
      }
    });
  }

}
