export function createGameLoop(update, render) {
  let lastTime = null;
  let animFrameId = null;
  let running = false;

  function tick(timestamp) {
    if (!running) return;
    if (lastTime === null) lastTime = timestamp;
    const dt = Math.min(timestamp - lastTime, 100);
    lastTime = timestamp;
    update(dt);
    render();
    animFrameId = requestAnimationFrame(tick);
  }

  return {
    start() {
      running = true;
      lastTime = null;
      animFrameId = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    },
  };
}
