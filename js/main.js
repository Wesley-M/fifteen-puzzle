const board_length = 4;

// Load and set all the sounds needed

background_sound = new Sound("snd/creepy.mp3", 1);
background_sound.loop(true);

move_sound = new Sound("snd/neutral.wav", 0.5);
positive_sound = new Sound("snd/positive.wav", 0.2);

congratulations_sound = new Sound("snd/you_win.ogg", 1);
win_sound = new Sound("snd/winning.wav", 1);


// Congratulate user that cleared the game
var congratulate = function () {
  background_sound.stop();
  win_sound.play();
  setTimeout(function(){ congratulations_sound.play(); }, 1500);

  $("body").append("<h1 id='congrats'>You Win!</h1>");

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

board = new Board();

$("#restart-btn").click(function(){
  board.init();
  setTimeout(function(){ board.drawBoard(); }, 1000);
});

$("#no-sound-btn").click(function(){
  background_sound.toggle();
});

// Listen to click on play button
$(document).ready(function(){
  $("#start-button").click(function(){
    $(this).add("#menu-game").fadeOut();
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
