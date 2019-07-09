function Timer(el) {

  var minutes;
  var seconds;
  var element = el;
  var isPaused;
  var timerInterval;

  var init = function() {
    minutes = 0;
    seconds = 0;
    isPaused = false;
  }

  this.start = function () {
    init();
    writeInTimer("00", "00");
    timerInterval = setInterval(function() {
      if (!isPaused) {
        seconds++;
        if (seconds === 60) {
          minutes++;
          seconds = 0;
          if (minutes === 60) {
            clearInterval();
          }
        }
        writeInTimer(minutes, seconds);
      }
    }, 1000);
  }

  this.pause = function () {
    isPaused = true;
  }

  this.resume = function () {
    isPaused = false;
  }

  this.reset = function () {
    init();
    this.pause();
    if (timerInterval != "undefined") {
      clearInterval(timerInterval);
    }
    writeInTimer(minutes, seconds);
  }

  this.isRunning = function () {
    return (isPaused != undefined) ? !isPaused : false;
  }

  this.getTime = function () {
      return formatTime(minutes, seconds);
  }

  var writeInTimer = function (minutes, seconds) {
    $(el).empty();
    $(el).append(formatTime(minutes, seconds));
  }

  var padTime = function (number) {
    return (number + "").padStart(2,0);
  }

  var formatTime = function (minutes, seconds) {
    return padTime(minutes) + ":" + padTime(seconds)
  }

}
