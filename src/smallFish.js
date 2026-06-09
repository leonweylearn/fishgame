function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const WANDER_MIN = 1200;
const WANDER_MAX = 3000;

export class SmallFish {
  constructor(canvasWidth, canvasHeight, minRadius, maxRadius) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.active = true;
    this._spawn(false);
  }

  _spawn(fromEdge) {
    this.radius = rand(this.minRadius, this.maxRadius);
    this.speed  = rand(40, 90);
    this.angle  = rand(0, Math.PI * 2);
    this.wanderTimer = rand(WANDER_MIN, WANDER_MAX);
    this.spawnGrace = 1500; // ms — cannot trigger game-over during this window

    if (fromEdge) {
      const edge = Math.floor(Math.random() * 4);
      const r = this.radius;
      const w = this.canvasWidth;
      const h = this.canvasHeight;
      if      (edge === 0) { this.x = -r;    this.y = rand(0, h); }
      else if (edge === 1) { this.x = w + r; this.y = rand(0, h); }
      else if (edge === 2) { this.x = rand(0, w); this.y = -r;    }
      else                 { this.x = rand(0, w); this.y = h + r; }
    } else {
      const m = 40;
      this.x = rand(m, this.canvasWidth  - m);
      this.y = rand(m, this.canvasHeight - m);
    }
  }

  respawn() {
    this.active = true;
    this._spawn(true);
  }

  update(dt) {
    if (this.spawnGrace > 0) this.spawnGrace = Math.max(0, this.spawnGrace - dt);
    const sec = dt / 1000;
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.angle = rand(0, Math.PI * 2);
      this.wanderTimer = rand(WANDER_MIN, WANDER_MAX);
    }

    this.x += Math.cos(this.angle) * this.speed * sec;
    this.y += Math.sin(this.angle) * this.speed * sec;

    const r = this.radius;
    if (this.x < r)                     { this.x = r;                    this.angle = Math.PI - this.angle; }
    if (this.x > this.canvasWidth  - r) { this.x = this.canvasWidth - r; this.angle = Math.PI - this.angle; }
    if (this.y < r)                     { this.y = r;                    this.angle = -this.angle; }
    if (this.y > this.canvasHeight - r) { this.y = this.canvasHeight - r; this.angle = -this.angle; }
  }

  get color() {
    const r = this.radius;
    if (r < 12) return '#ffe066';
    if (r < 20) return '#ff9944';
    if (r < 30) return '#ff5588';
    return '#bb44ff';
  }
}
