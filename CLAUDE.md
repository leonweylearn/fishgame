# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

This project uses ES6 modules, which require an HTTP server (browsers block `file://` module imports).

```bash
# Option 1 — Node.js
npx serve .

# Option 2 — Python
python -m http.server 8080

# Option 3 — VS Code Live Server extension (right-click index.html → Open with Live Server)
```

Then open `http://localhost:3000` (or whichever port is shown).

## Architecture

Pure HTML5 Canvas + vanilla JS. No build step, no dependencies, no bundler.

**Data flow per frame:**
```
main.js → gameLoop (RAF tick)
            ├── game.update(dt)
            │     ├── player.update(dt)   ← reads input.js key state
            │     ├── fish[].update(dt)   ← each SmallFish wanders
            │     ├── _checkCollisions()  ← circlesOverlap() per fish
            │     └── _replenishFish()    ← keeps FISH_COUNT fish on screen
            └── game.render()
                  ├── drawBackground()
                  ├── drawFish() × N      ← small fish
                  ├── drawFish() × 1      ← player (with glow)
                  └── drawUI() / overlay screens
```

**Key design decisions:**
- `gameLoop.js` caps `dt` at 100 ms to prevent position jumps after tab-switch.
- `playerFish.js` normalises the diagonal input vector so diagonal speed equals axis-aligned speed.
- `smallFish.js` bounces off walls by reflecting the angle. Fish spawned mid-game always enter from a screen edge via `respawn()`.
- Collision is circle-vs-circle. Player eats a fish only if `player.radius > fish.radius`; a fish triggers game-over if `fish.radius > player.radius * 1.15`.
- `game.js` prunes the `fishes` array when it exceeds `FISH_COUNT * 3` to prevent unbounded growth.

## File Map

| File | Responsibility |
|------|----------------|
| `src/main.js` | Canvas sizing, loop creation, entry point |
| `src/game.js` | State machine (`start`/`running`/`gameover`), orchestration |
| `src/gameLoop.js` | `requestAnimationFrame` loop with capped delta time |
| `src/input.js` | Keyboard state (`isKeyDown`) |
| `src/playerFish.js` | Player entity: movement, growth on eat |
| `src/smallFish.js` | AI fish entity: wander, wall-bounce, edge respawn |
| `src/collision.js` | `circlesOverlap(a, b)` — pure geometry |
| `src/renderer.js` | All Canvas drawing: fish shapes, UI, overlay screens |
