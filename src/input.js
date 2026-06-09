const keys = new Set();

window.addEventListener('keydown', e => {
  keys.add(e.key);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
});

window.addEventListener('keyup', e => keys.delete(e.key));

export function isKeyDown(key) {
  return keys.has(key);
}
