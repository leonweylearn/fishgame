import { isKeyDown } from './input.js';

const BASE_SPEED = 180;
const BASE_RADIUS = 22;
const GROWTH_PER_EAT = 2.5;

export class PlayerFish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = BASE_RADIUS;
    this.angle = 0;
    this.speed = BASE_SPEED;
  }

  update(dt, canvasWidth, canvasHeight) {
    const sec = dt / 1000;
    let dx = 0;
    let dy = 0;

    if (isKeyDown('ArrowLeft')  || isKeyDown('a') || isKeyDown('A')) dx -= 1;
    if (isKeyDown('ArrowRight') || isKeyDown('d') || isKeyDown('D')) dx += 1;
    if (isKeyDown('ArrowUp')    || isKeyDown('w') || isKeyDown('W')) dy -= 1;
    if (isKeyDown('ArrowDown')  || isKeyDown('s') || isKeyDown('S')) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      this.angle = Math.atan2(dy / len, dx / len);
    }

    this.x += dx * this.speed * sec;
    this.y += dy * this.speed * sec;

    this.x = Math.max(this.radius, Math.min(canvasWidth  - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));
  }

  eat() {
    this.radius += GROWTH_PER_EAT;
    // Gradually slow as the fish grows
    this.speed = Math.max(90, BASE_SPEED - (this.radius - BASE_RADIUS) * 0.8);
  }
}
