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
