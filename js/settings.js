const BOARD_LENGTH = 4;

// Load and set sound variables
const SOUNDS = {
  "background"   : new Sound("snd/creepy.mp3", 1, true),
  "move"         : new Sound("snd/neutral.wav", 0.5),
  "correctPiece" : new Sound("snd/positive.wav", 0.2),
  "winOne"       : new Sound("snd/you_win.ogg", 1),
  "winTwo"       : new Sound("snd/winning.wav", 1)
}

// Keys for moves
const KEYS_MOVES = {
  37 : "left",
  38 : "up",
  39 : "right",
  40 : "down"
};

// Map events of hammer.js to action in the game
const EVENTS_MOVES = {
  "swipeleft"  : "left",
  "swiperight" : "right",
  "swipeup"    : "up",
  "swipedown"  : "down"
};

// Set informations of movements based in the direction
const MOVE_TO = {
  "up": {
    "change_x": 1,
    "change_y": 0,
    "limit_x": BOARD_LENGTH-1,
    "limit_y": undefined
  },
  "down": {
    "change_x": -1,
    "change_y": 0,
    "limit_x": 0,
    "limit_y": undefined
  },
  "left": {
    "change_x": 0,
    "change_y": 1,
    "limit_x": undefined,
    "limit_y": BOARD_LENGTH - 1
  },
  "right": {
    "change_x": 0,
    "change_y": -1,
    "limit_x": undefined,
    "limit_y": 0
  }
};
