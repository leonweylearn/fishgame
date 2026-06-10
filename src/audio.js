let _ctx = null;
let _master = null;
let _running = false;
let _timerID = null;
let _melodyTime = 0;
let _bassTime = 0;
let _melodyIdx = 0;
let _bassIdx = 0;

const BPM = 78;
const B = 60 / BPM;
const LOOKAHEAD = 0.25;
const INTERVAL = 60;

// C pentatonic melody  [frequency Hz, beats]
const MELODY = [
  [261.63, 1  ],
  [293.66, 0.5], [329.63, 0.5],
  [392.00, 1.5], [0,      0.5],
  [440.00, 1  ],
  [392.00, 0.5], [349.23, 0.5],
  [329.63, 1.5], [0,      0.5],
  [293.66, 1  ],
  [261.63, 2  ],
  [0,      1  ],
  [220.00, 1  ],
  [261.63, 0.5], [293.66, 0.5],
  [261.63, 2  ],
  [0,      2  ],
];

// Bass line
const BASS = [
  [65.41, 4],
  [87.31, 4],
  [98.00, 4],
  [87.31, 2], [65.41, 2],
];

function _ensureCtx() {
  if (_ctx) return;
  _ctx = new AudioContext();
  _master = _ctx.createGain();
  _master.gain.value = 0.35;
  _master.connect(_ctx.destination);
}

function _note(freq, startTime, duration, type, vol) {
  if (freq === 0) return;
  const osc = _ctx.createOscillator();
  const env = _ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(env);
  env.connect(_master);

  const rel = Math.min(duration * 0.25, 0.18);
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(vol, startTime + 0.04);
  env.gain.setValueAtTime(vol, startTime + duration - rel);
  env.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

function _schedule() {
  const horizon = _ctx.currentTime + LOOKAHEAD;

  while (_melodyTime < horizon) {
    const [f, b] = MELODY[_melodyIdx % MELODY.length];
    _note(f, _melodyTime, b * B, 'triangle', 0.14);
    _melodyTime += b * B;
    _melodyIdx++;
  }

  while (_bassTime < horizon) {
    const [f, b] = BASS[_bassIdx % BASS.length];
    _note(f, _bassTime, b * B, 'sine', 0.18);
    _bassTime += b * B;
    _bassIdx++;
  }

  if (_running) _timerID = setTimeout(_schedule, INTERVAL);
}

export function startMusic() {
  _ensureCtx();
  if (_ctx.state === 'suspended') _ctx.resume();
  clearTimeout(_timerID);
  _master.gain.cancelScheduledValues(_ctx.currentTime);
  _master.gain.setValueAtTime(0.35, _ctx.currentTime);
  _running = true;
  _melodyTime = _ctx.currentTime + 0.1;
  _bassTime   = _ctx.currentTime + 0.1;
  _melodyIdx  = 0;
  _bassIdx    = 0;
  _schedule();
}

export function stopMusic() {
  _running = false;
  clearTimeout(_timerID);
  _timerID = null;
  if (_master && _ctx) {
    const now = _ctx.currentTime;
    _master.gain.cancelScheduledValues(now);
    _master.gain.setValueAtTime(_master.gain.value, now);
    _master.gain.linearRampToValueAtTime(0, now + 0.8);
  }
}

export function playEatSound() {
  _ensureCtx();
  const now = _ctx.currentTime;
  const osc = _ctx.createOscillator();
  const env = _ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
  env.gain.setValueAtTime(0.45, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(env);
  env.connect(_ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

export function playGameOverSound() {
  _ensureCtx();
  const now = _ctx.currentTime;
  const notes = [440, 349.23, 293.66, 220];
  notes.forEach((freq, i) => {
    const t = now + i * 0.18;
    const osc = _ctx.createOscillator();
    const env = _ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    env.gain.setValueAtTime(0.35, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc.connect(env);
    env.connect(_ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  });
}
