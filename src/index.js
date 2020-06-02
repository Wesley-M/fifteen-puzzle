import Game from './entities/Game.js'
import Renderer from './renderer/Renderer.js'

let fifteenPuzzle = new Game();
let renderer = new Renderer(fifteenPuzzle);

fifteenPuzzle.play();
renderer.run();