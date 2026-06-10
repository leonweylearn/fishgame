import { PlayerFish } from './playerFish.js';
import { SmallFish } from './smallFish.js';
import { circlesOverlap } from './collision.js';
import {
  drawBackground, drawFish, drawUI,
  drawStartScreen, drawGameOverScreen,
} from './renderer.js';
import { startMusic, stopMusic } from './audio.js';

const FISH_COUNT = 12;
const PREDATOR_MIN = 2; // try to keep at least this many dangerous fish on screen
const PREDATOR_MAX = 3; // never exceed this many fish larger than the player

const SIZE_TIERS = [
  [5,  11],
  [9,  17],
  [14, 24],
  [20, 34],
  [28, 44],
];

function randomTier() {
  return SIZE_TIERS[Math.floor(Math.random() * SIZE_TIERS.length)];
}

function predatorTier(playerRadius) {
  return [playerRadius * 1.2, playerRadius * 2.0];
}

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'start';
    this.score = 0;
    this.player = null;
    this.fishes = [];

    window.addEventListener('keydown', (e) => { if (e.code === 'Space') this._onSpaceKey(); });
  }

  _onSpaceKey() {
    if (this.state === 'start' || this.state === 'gameover') {
      this._startGame();
    }
  }

  _startGame() {
    const { width, height } = this.canvas;
    this.score = 0;
    this.player = new PlayerFish(width / 2, height / 2);
    this.fishes = Array.from({ length: FISH_COUNT }, () => {
      const [mn, mx] = randomTier();
      return new SmallFish(width, height, mn, mx);
    });
    this.state = 'running';
    startMusic();
  }

  update(dt) {
    if (this.state !== 'running') return;
    const { width, height } = this.canvas;

    this.player.update(dt, width, height);
    for (const f of this.fishes) f.update(dt);

    this._checkCollisions();
    this._replenishFish();
  }

  _checkCollisions() {
    for (const fish of this.fishes) {
      if (!fish.active || !circlesOverlap(this.player, fish)) continue;

      if (this.player.radius > fish.radius) {
        fish.active = false;
        this.score += Math.ceil(fish.radius);
        this.player.eat();
      } else if (fish.radius > this.player.radius * 1.15 && fish.spawnGrace <= 0) {
        this.state = 'gameover';
        stopMusic();
        return;
      }
    }
  }

  _replenishFish() {
    const active = this.fishes.filter(f => f.active);
    const needed = FISH_COUNT - active.length;
    if (needed === 0) return;

    const bigFishCount   = active.filter(f => f.radius > this.player.radius).length;
    const activePredators = active.filter(f => f.radius > this.player.radius * 1.15).length;
    // Maintain PREDATOR_MIN dangerous fish, but never let big-fish total exceed PREDATOR_MAX
    const predatorBudget = Math.max(0, PREDATOR_MAX - bigFishCount);
    let predatorsToSpawn = Math.min(predatorBudget, Math.max(0, PREDATOR_MIN - activePredators));

    for (let i = 0; i < needed; i++) {
      const spawnAsPredator = predatorsToSpawn > 0;
      const [mn, mx] = spawnAsPredator
        ? predatorTier(this.player.radius)
        : randomTier();

      if (spawnAsPredator) predatorsToSpawn--;

      const f = new SmallFish(this.canvas.width, this.canvas.height, mn, mx);
      f.respawn();
      this.fishes.push(f);
    }

    if (this.fishes.length > FISH_COUNT * 3) {
      this.fishes = this.fishes.filter(f => f.active);
    }
  }

  render() {
    const { ctx, canvas } = this;
    const { width, height } = canvas;

    drawBackground(ctx, width, height);

    if (this.state === 'start') {
      drawStartScreen(ctx, width, height);
      return;
    }

    for (const fish of this.fishes) {
      if (fish.active) drawFish(ctx, fish.x, fish.y, fish.radius, fish.angle, fish.color);
    }

    drawFish(ctx, this.player.x, this.player.y, this.player.radius, this.player.angle, '#00e5ff', true);
    drawUI(ctx, this.score, this.player.radius, width);

    if (this.state === 'gameover') {
      drawGameOverScreen(ctx, this.score, width, height);
    }
  }
}
