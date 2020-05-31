const BOARD_LENGTH = 4;

// Load and set sound variables
const SOUNDS = {
  "background"   : new Sound("../res/snd/mystery.ogg", 0.6, true),
  "move"         : new Sound("../res/snd/neutral.wav", 0.2),
  "correctPiece" : new Sound("../res/snd/positive.wav", 0.1),
  "winOne"       : new Sound("../res/snd/you_win.ogg", 0.6),
  "winTwo"       : new Sound("../res/snd/winning.wav", 0.6),
  "restart"      : new Sound("../res/snd/collect.ogg", 0.6)
}

// Keys for moves
const KEYS_TO_DIRECTIONS = {
  37 : "left",
  38 : "up",
  39 : "right",
  40 : "down"
};

// Map events of hammer.js to action in the game
const EVENTS_TO_DIRECTIONS = {
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
