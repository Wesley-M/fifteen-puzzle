class Timer {
  
  constructor(el) {
    this._minutes = 0;
    this._seconds = 0;
    this._element = el;
    this._isPaused = false;
    this._timerInterval;
  }

  _init() {
    this._minutes = 0;
    this._seconds = 0;
    this._isPaused = false;
  }

  start() {
    this._init();
    this._writeInTimer("00", "00");
    this._timerInterval = setInterval(() => {
      if (!this._isPaused) {
        this._seconds++;
        if (this._seconds === 60) {
          this._minutes++;
          this._seconds = 0;
          if (this._minutes === 60) {
            clearInterval();
          }
        }
        this._writeInTimer(this._minutes, this._seconds);
      }
    }, 1000);
  }

  pause() {
    this._isPaused = true;
  }

  resume() {
    this._isPaused = false;
  }

  reset() {
    this._init();
    this.pause();
    if (this._timerInterval != "undefined") {
      clearInterval(this._timerInterval);
    }
    this._writeInTimer(this._minutes, this._seconds);
  }

  get running () {
    return (this._isPaused != undefined) ? !this._isPaused : false;
  }

  get time () {
    return this._formatTime(this._minutes, this._seconds);
  }

  _writeInTimer(minutes, seconds) {
    $(this._element).empty();
    $(this._element).append(this._formatTime(minutes, seconds));
  }

  _padTime(number) {
    return String(number).padStart(2,0);
  }

  _formatTime(minutes, seconds) {
    return this._padTime(minutes) + ":" + this._padTime(seconds)
  }

}
