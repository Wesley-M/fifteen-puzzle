function Timer(el) {
  var minutes;
  var seconds;
  var element = el;
  var is_paused;

  this.init = function(el) {
    minutes = 0;
    seconds = 0;
    is_paused = false;
  }

  var padStartTime = function (number){
    return (number+"").padStart(2,0);
  }

  this.execute = function () {
    $(el).append("00:00");
    setInterval(function() {
      if (!is_paused){
        seconds++;
        if (seconds === 60){
          minutes++;
          seconds = 0;
          if (minutes === 60){
            clearInterval();
          }
        }

        $(el).empty();
        $(el).append(padStartTime(minutes) + ":" + padStartTime(seconds));
      }
    }, 1000);
  }

  this.pause = function () {
    is_paused = true;
  }

  this.resume = function () {
    is_paused = false;
  }

  this.restart = function () {
    minutes = 0;
    seconds = 0;
  }
}
