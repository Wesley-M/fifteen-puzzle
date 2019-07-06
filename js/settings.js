const BOARD_LENGTH = 4;

// Load and set sound variables

BACKGROUND_SOUND = new Sound("snd/creepy.mp3", 1);
BACKGROUND_SOUND.loop(true);

MOVE_SOUND = new Sound("snd/neutral.wav", 0.5);
POSITIVE_SOUND = new Sound("snd/positive.wav", 0.2);

CONGRATULATIONS_SOUND = new Sound("snd/you_win.ogg", 1);
WIN_SOUND = new Sound("snd/winning.wav", 1);

// Keys for moves

KEYS_MOVES = {
  37:"left",
  38:"up",
  39:"right",
  40:"down"
}

// Events to moves in hammer.js

EVENTS_MOVES = {
  "swipeleft": "left",
  "swiperight": "right",
  "swipeup": "up",
  "swipedown": "down"
}

// Set variables to move
moveTo = {
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
