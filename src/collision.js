// Fish bodies are ellipses (~58% as tall as wide), so shrink the circular
// hitbox to avoid false-positive collisions in the vertical direction.
const HITBOX_SCALE = 0.75;

export function circlesOverlap(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const combined = (a.radius + b.radius) * HITBOX_SCALE;
  return dx * dx + dy * dy < combined * combined;
}
