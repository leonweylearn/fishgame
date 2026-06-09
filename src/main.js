import { createGameLoop } from './gameLoop.js';
import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

const game = new Game(canvas);
const loop = createGameLoop(
  dt => game.update(dt),
  ()  => game.render(),
);

loop.start();
