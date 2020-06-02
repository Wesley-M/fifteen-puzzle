const BOARD_LENGTH = 4;

const SOUND_DIR = location.href + "res/snd/";

const MAX_SCORE = 9999;

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

export { 
  BOARD_LENGTH, 
  SOUND_DIR, 
  MAX_SCORE,
  KEYS_TO_DIRECTIONS, 
  EVENTS_TO_DIRECTIONS, 
  MOVE_TO
};