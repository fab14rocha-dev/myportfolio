// main.js — Paperboy game

// =============================================================
// CANVAS
// =============================================================
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = 1040;
canvas.height = 650;

// =============================================================
// AUDIO  (Web Audio API — no libraries needed)
// =============================================================
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playWhoosh() {
  try {
    const ac = getAudio();
    const buf  = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf;
    const flt = ac.createBiquadFilter(); flt.type = 'bandpass';
    flt.frequency.setValueAtTime(2000, ac.currentTime);
    flt.frequency.linearRampToValueAtTime(400, ac.currentTime + 0.15);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.15);
    src.connect(flt); flt.connect(gain); gain.connect(ac.destination);
    src.start();
  } catch(e) {}
}

function playCrash() {
  try {
    const ac = getAudio();
    const buf  = ac.createBuffer(1, ac.sampleRate * 0.4, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
    const src  = ac.createBufferSource(); src.buffer = buf;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.6, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.4);
    src.connect(gain); gain.connect(ac.destination);
    src.start();
  } catch(e) {}
}

function playDing() {
  try {
    const ac  = getAudio();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(1320, ac.currentTime + 0.1);
    gain.gain.setValueAtTime(0.4, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 0.5);
  } catch(e) {}
}

function playMiss() {
  try {
    const ac  = getAudio();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ac.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 0.3);
  } catch(e) {}
}

function playHeartPickup() {
  try {
    const ac  = getAudio();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, ac.currentTime);
    osc.frequency.setValueAtTime(659, ac.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ac.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.45);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 0.45);
  } catch(e) {}
}

function playHedgehogHit() {
  try {
    const ac = getAudio();
    // Descending "bonk" tone — like hitting something hard and spiky
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(550, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ac.currentTime + 0.28);
    gain.gain.setValueAtTime(0.35, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 0.3);
    // Short noise burst for the "spiky" impact
    const buf  = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ac.createBufferSource(); src.buffer = buf;
    const ng  = ac.createGain(); ng.gain.setValueAtTime(0.4, ac.currentTime);
    src.connect(ng); ng.connect(ac.destination);
    src.start();
  } catch(e) {}
}

function playLizardHit() {
  try {
    const ac = getAudio();
    // Fast rising-then-falling chirp — like a startled lizard squeak
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ac.currentTime + 0.07);
    osc.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.18);
    gain.gain.setValueAtTime(0.28, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.2);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 0.2);
  } catch(e) {}
}

// =============================================================
// HIGH SCORE
// =============================================================
let highScore = parseInt(localStorage.getItem('paperboy_hs') || '0');

// =============================================================
// LEVELS
// =============================================================
const LEVEL_CONFIGS = [
  { houses: 10, missLimit: 3, speed: 3,   obstacleCount: 5  },
  { houses: 14, missLimit: 4, speed: 3.5, obstacleCount: 7  },
  { houses: 18, missLimit: 5, speed: 4,   obstacleCount: 9  },
  { houses: 22, missLimit: 6, speed: 4.5, obstacleCount: 11 },
  { houses: 26, missLimit: 7, speed: 5,   obstacleCount: 13 },
];

function getLevelConfig(level) {
  if (level <= LEVEL_CONFIGS.length) return LEVEL_CONFIGS[level - 1];
  const extra = level - LEVEL_CONFIGS.length;
  const base  = LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  return {
    houses:        base.houses        + extra * 4,
    missLimit:     base.missLimit     + extra,
    speed:         Math.min(base.speed + extra * 0.5, 7),
    obstacleCount: Math.min(base.obstacleCount + extra * 2, 18),
  };
}

let currentLevel   = 1;
let levelDelivered = 0;
let levelMissed    = 0;
let failReason     = '';

// =============================================================
// LAYOUT
// =============================================================
const road = { left: 338, right: 702, color: '#5a5a5a' };
const SIDEWALK_W = 50;

// =============================================================
// GAME STATE
// =============================================================
let gameState = 'charselect'; // 'charselect' | 'start' | 'playing' | 'levelcomplete' | 'levelfailed' | 'gameover'

// =============================================================
// CHARACTER
// =============================================================
const CHARACTERS = {
  lucas: {
    name:    'Lucas',
    color:   '#e63946',   // red jacket
    helmet:  '#c1121f',
    visor:   '#ffd700',
    skin:    '#f4a261',
    pants:   '#c1440e',
  },
  matteo: {
    name:    'Matteo',
    color:   '#2176ae',   // blue jacket
    helmet:  '#023e8a',
    visor:   '#90e0ef',
    skin:    '#f4d35e',
    pants:   '#1a5276',
  },
};
let selectedChar = null; // set on character select screen

// =============================================================
// SCROLL & DIFFICULTY
// =============================================================
let scrollY      = 0;
let stripeOffset = 0;
let gameTime     = 0;   // frames elapsed since game started
let gameSpeed    = 3;   // increases over time

function updateDifficulty() {
  gameTime++;
  // Speed is set per-level — no automatic increase during play
}

// =============================================================
// PLAYER
// =============================================================
const player = {
  x: (road.left + road.right) / 2 - 20,
  y: 480,
  width:  40,
  height: 60,
  speed:  4,
  color:  '#e63946',   // overwritten when character is chosen
  invincible: 0,
  // Leg animation
  legAngle: 0
};

// =============================================================
// INPUT
// =============================================================
const keys = {};
document.addEventListener('keydown', e => {
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault(); // stop browser from scrolling page or activating focused buttons
  }
  keys[e.key] = true;
  if (gameState === 'charselect') {
    if (e.key === '1') { selectedChar = CHARACTERS.lucas;  gameState = 'start'; }
    if (e.key === '2') { selectedChar = CHARACTERS.matteo; gameState = 'start'; }
  }
  if (gameState === 'start')                       { gameState = 'playing'; }
  if (gameState === 'levelcomplete' && e.key === ' ') { startLevel(currentLevel + 1); }
  if (gameState === 'levelfailed'   && e.key === ' ') { lives = 3; startLevel(currentLevel); }
  if (gameState === 'levelfailed'   && e.key === 'r') { resetGame(); }
  if (gameState === 'gameover'      && e.key === ' ') { resetGame(); }
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

// =============================================================
// FLOATING SCORE TEXTS
// =============================================================
const floats = [];
function addFloat(text, x, y, color) {
  floats.push({ text, x, y, color, alpha: 1 });
}
function updateFloats() {
  for (let i = floats.length - 1; i >= 0; i--) {
    floats[i].y    -= 1.2;
    floats[i].alpha -= 0.018;
    if (floats[i].alpha <= 0) floats.splice(i, 1);
  }
}
function drawFloats() {
  floats.forEach(f => {
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle   = f.color;
    ctx.font        = 'bold 22px monospace';
    ctx.textAlign   = 'center';
    ctx.fillText(f.text, f.x, f.y);
    ctx.restore();
  });
}

// =============================================================
// HOUSES
// =============================================================
const HOUSE_W = 88;
const HOUSE_H = 72;

function makeHouse(worldY, side) {
  return { worldY, side, delivered: false, penalized: false };
}
function houseScreenX(side) {
  return side === 'left'
    ? road.left - SIDEWALK_W - HOUSE_W - 10
    : road.right + SIDEWALK_W + 10;
}

let houses = [];
function spawnHouses() {
  houses = [];
  const n = getLevelConfig(currentLevel).houses;
  for (let i = 0; i < n; i++) {
    const wy = -(i * 250 + 300);
    houses.push(makeHouse(wy, i % 2 === 0 ? 'left' : 'right'));
  }
}
function updateHouses() {
  if (gameState !== 'playing') return;
  const cfg = getLevelConfig(currentLevel);
  houses.forEach(h => {
    const sy = h.worldY + scrollY;
    if (sy > canvas.height + 80 && !h.delivered && !h.penalized) {
      h.penalized = true;
      levelMissed++;
      score = Math.max(0, score - 5);
      addFloat('-5', houseScreenX(h.side) + HOUSE_W / 2, canvas.height - 20, '#ff4444');
      playMiss();
      // Fail immediately if miss limit exceeded
      if (levelMissed > cfg.missLimit) {
        if (score > highScore) { highScore = score; localStorage.setItem('paperboy_hs', highScore); }
        failReason  = 'misses';
        gameState   = 'levelfailed';
        return;
      }
    }
  });
  // Check if all houses are resolved (delivered + missed = total)
  if (levelDelivered + levelMissed >= cfg.houses) checkLevelEnd();
}

// =============================================================
// TREES
// =============================================================
let trees = [];
function spawnTrees() {
  trees = [];
  for (let i = 0; i < 24; i++) {
    const wy = -(i * 110 + 40);
    trees.push({
      worldY: wy,
      x: 20 + Math.random() * (road.left - SIDEWALK_W - 60),
      size: 18 + Math.random() * 14
    });
    trees.push({
      worldY: wy - Math.random() * 55,
      x: road.right + SIDEWALK_W + 20 + Math.random() * (canvas.width - road.right - SIDEWALK_W - 60),
      size: 18 + Math.random() * 14
    });
  }
}
function recycleTrees() {
  trees.forEach(t => {
    if (t.worldY + scrollY > canvas.height + 40)
      t.worldY -= trees.length * 55 + Math.random() * 80;
  });
}

// =============================================================
// OBSTACLES
// =============================================================
const OBS_TYPES = [
  { type: 'car',      w: 48, h: 88, color: '#1d3557', color2: '#457b9d',  livesLost: 1 },
  { type: 'car',      w: 48, h: 88, color: '#d62828', color2: '#f77f00',  livesLost: 1 },
  { type: 'car',      w: 48, h: 88, color: '#606c38', color2: '#dda15e',  livesLost: 1 },
  { type: 'dog',      w: 32, h: 24, color: '#8B4513', color2: '#a0522d',  livesLost: 1 },
  { type: 'trashcan', w: 26, h: 38, color: '#457b9d', color2: '#74b0c9',  livesLost: 1 },
  { type: 'hedgehog', w: 38, h: 30, color: '#5d4037', color2: '#d4a96a',  livesLost: 2 },
  { type: 'hedgehog', w: 38, h: 30, color: '#5d4037', color2: '#d4a96a',  livesLost: 2 },
];

let obstacles = [];
function spawnObstacles() {
  obstacles = [];
  const count = getLevelConfig(currentLevel).obstacleCount;
  for (let i = 0; i < count; i++) spawnObstacle(-(i * 320 + 500));
}
function spawnObstacle(wy) {
  const t   = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
  const rw  = road.right - road.left;
  const x   = road.left + 20 + Math.random() * (rw - t.w - 40);
  obstacles.push({ ...t, worldY: wy, x });
}
function recycleObstacles() {
  obstacles.forEach(obs => {
    if (obs.worldY + scrollY > canvas.height + 80) {
      obs.worldY -= obstacles.length * 320 + Math.random() * 200;
      const t    = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
      const rw   = road.right - road.left;
      obs.x      = road.left + 20 + Math.random() * (rw - t.w - 40);
      Object.assign(obs, t);
    }
  });
}

// =============================================================
// LIZARDS  (spawn from houses, cross the road, -1 life on hit)
// =============================================================
let lizards = [];
let lizardTimer = 0;

function spawnLizard() {
  const visible = houses.filter(h => {
    const sy = h.worldY + scrollY;
    return sy > 80 && sy < canvas.height - 40;
  });
  if (visible.length === 0) return;
  const h  = visible[Math.floor(Math.random() * visible.length)];
  const sy = h.worldY + scrollY + HOUSE_H * 0.55;
  let x, vx;
  if (h.side === 'left') {
    x  = road.left - SIDEWALK_W + 2;
    vx = 2.2 + Math.random() * 1.2;
  } else {
    x  = road.right + SIDEWALK_W - 24;
    vx = -(2.2 + Math.random() * 1.2);
  }
  lizards.push({ x, y: sy, vx, w: 24, h: 12 });
}

function updateLizards() {
  lizardTimer++;
  if (lizardTimer % 200 === 0) spawnLizard();
  for (let i = lizards.length - 1; i >= 0; i--) {
    lizards[i].x += lizards[i].vx;
    if (lizards[i].x < -50 || lizards[i].x > canvas.width + 50)
      lizards.splice(i, 1);
  }
}

function checkLizardCollisions() {
  if (player.invincible > 0) return;
  for (let i = lizards.length - 1; i >= 0; i--) {
    const liz = lizards[i];
    if (
      player.x + player.width  > liz.x + 3     &&
      player.x + 3             < liz.x + liz.w  &&
      player.y + player.height > liz.y + 2      &&
      player.y + 10            < liz.y + liz.h
    ) {
      lives--;
      player.invincible = 100;
      lizards.splice(i, 1);
      addFloat('LIZARD! -1 ♥', player.x + player.width / 2, player.y - 10, '#ff8800');
      playLizardHit();
      if (lives <= 0) {
        if (score > highScore) { highScore = score; localStorage.setItem('paperboy_hs', highScore); }
        failReason = 'lives';
        gameState  = 'levelfailed';
      }
      break;
    }
  }
}

function drawLizards() {
  lizards.forEach(liz => {
    ctx.save();
    // Flip sprite when moving left
    if (liz.vx < 0) {
      ctx.translate(liz.x + liz.w, liz.y);
      ctx.scale(-1, 1);
      ctx.translate(-liz.x, -liz.y);
    }
    // Tail
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(liz.x + 3, liz.y + liz.h / 2);
    ctx.quadraticCurveTo(liz.x - 8, liz.y + liz.h / 2 - 3, liz.x - 5, liz.y + liz.h / 2 - 9);
    ctx.stroke();
    // Body
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(liz.x + liz.w * 0.44, liz.y + liz.h / 2, liz.w * 0.38, liz.h * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#66bb6a';
    ctx.beginPath();
    ctx.ellipse(liz.x + liz.w * 0.82, liz.y + liz.h / 2, liz.w * 0.2, liz.h * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(liz.x + liz.w * 0.9, liz.y + liz.h * 0.3, 1.8, 0, Math.PI * 2); ctx.fill();
    // Legs (4)
    ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 2;
    [[0.28, -1], [0.28, 1], [0.58, -1], [0.58, 1]].forEach(([rx, dir]) => {
      ctx.beginPath();
      ctx.moveTo(liz.x + liz.w * rx, liz.y + liz.h * 0.5);
      ctx.lineTo(liz.x + liz.w * rx - 4, liz.y + liz.h * 0.5 + dir * liz.h * 0.55);
      ctx.stroke();
    });
    ctx.restore();
  });
}

// =============================================================
// HEARTS  (road pickups, +1 life)
// =============================================================
let hearts = [];

function spawnHearts() {
  hearts = [];
  for (let i = 0; i < 4; i++) {
    const wy = -(i * 1400 + 800 + Math.random() * 400);
    const rw = road.right - road.left;
    const x  = road.left + 30 + Math.random() * (rw - 60);
    hearts.push({ worldY: wy, x, w: 22, h: 20 });
  }
}

function recycleHearts() {
  hearts.forEach(h => {
    const sy = h.worldY + scrollY;
    if (sy > canvas.height + 30) {
      h.worldY -= 4200 + Math.random() * 800;
      const rw = road.right - road.left;
      h.x = road.left + 30 + Math.random() * (rw - 60);
    }
  });
}

function checkHeartCollisions() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h  = hearts[i];
    const sy = h.worldY + scrollY;
    if (
      player.x + player.width  > h.x      &&
      player.x                 < h.x + h.w &&
      player.y + player.height > sy        &&
      player.y + 10            < sy + h.h
    ) {
      lives = Math.min(lives + 1, 6);
      hearts.splice(i, 1);
      addFloat('+1 ♥', player.x + player.width / 2, player.y - 10, '#ff69b4');
      playHeartPickup();
      // Respawn this heart far ahead
      const rw = road.right - road.left;
      hearts.push({
        worldY: Math.min(...hearts.map(hh => hh.worldY)) - 1200 - Math.random() * 400,
        x: road.left + 30 + Math.random() * (rw - 60),
        w: 22, h: 20
      });
    }
  }
}

function drawHearts() {
  hearts.forEach(h => {
    const sy = h.worldY + scrollY;
    if (sy + h.h < 0 || sy > canvas.height) return;
    const cx = h.x + h.w / 2;
    const cy = sy + h.h / 2;
    // Glow
    ctx.fillStyle = 'rgba(255,100,150,0.18)';
    ctx.beginPath(); ctx.arc(cx, cy, h.w * 0.8, 0, Math.PI * 2); ctx.fill();
    // Heart shape
    ctx.fillStyle = '#ff3377';
    ctx.beginPath();
    ctx.moveTo(cx, cy + h.h * 0.38);
    ctx.bezierCurveTo(cx - h.w * 0.52, cy + h.h * 0.05, cx - h.w * 0.52, cy - h.h * 0.38, cx, cy - h.h * 0.12);
    ctx.bezierCurveTo(cx + h.w * 0.52, cy - h.h * 0.38, cx + h.w * 0.52, cy + h.h * 0.05, cx, cy + h.h * 0.38);
    ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 3, 4, 2.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// =============================================================
// NEWSPAPERS
// =============================================================
const papers = [];
let paperCooldown = 0;

// =============================================================
// SCORE & LIVES
// =============================================================
let score = 0;
let lives = 3;

// =============================================================
// RESET
// =============================================================
function setupLevel(level) {
  currentLevel   = level;
  levelDelivered = 0;
  levelMissed    = 0;
  failReason     = '';
  scrollY        = 0;
  stripeOffset   = 0;
  gameTime       = 0;
  gameSpeed      = getLevelConfig(level).speed;
  player.x       = (road.left + road.right) / 2 - 20;
  player.y       = 480;
  player.invincible = 0;
  player.legAngle   = 0;
  papers.length  = 0;
  floats.length  = 0;
  lizards.length = 0;
  paperCooldown  = 0;
  lizardTimer    = 0;
  spawnHouses();
  spawnTrees();
  spawnObstacles();
  spawnHearts();
}

function startLevel(level) {
  setupLevel(level);
  gameState = 'playing';
}

function checkLevelEnd() {
  if (gameState !== 'playing') return;
  const cfg = getLevelConfig(currentLevel);
  if (levelDelivered + levelMissed < cfg.houses) return;
  if (score > highScore) { highScore = score; localStorage.setItem('paperboy_hs', highScore); }
  gameState = levelMissed > cfg.missLimit ? 'levelfailed' : 'levelcomplete';
  if (gameState === 'levelfailed') failReason = 'misses';
}

function resetGame() {
  score = 0;
  lives = 3;
  startLevel(1);
}

// =============================================================
// DRAW: BACKGROUND
// =============================================================
function drawBackground() {
  // Far grass (left)
  ctx.fillStyle = '#4a8b2a';
  ctx.fillRect(0, 0, road.left - SIDEWALK_W, canvas.height);

  // Left sidewalk
  ctx.fillStyle = '#b0a080';
  ctx.fillRect(road.left - SIDEWALK_W, 0, SIDEWALK_W, canvas.height);

  // Road
  ctx.fillStyle = road.color;
  ctx.fillRect(road.left, 0, road.right - road.left, canvas.height);

  // Right sidewalk
  ctx.fillStyle = '#b0a080';
  ctx.fillRect(road.right, 0, SIDEWALK_W, canvas.height);

  // Far grass (right)
  ctx.fillStyle = '#4a8b2a';
  ctx.fillRect(road.right + SIDEWALK_W, 0, canvas.width - road.right - SIDEWALK_W, canvas.height);

  // Curbs
  ctx.fillStyle = '#d0d0c0';
  ctx.fillRect(road.left - 5, 0, 5, canvas.height);
  ctx.fillRect(road.right,    0, 5, canvas.height);

  // Dashed center line (animates with scroll)
  const cx = (road.left + road.right) / 2;
  ctx.strokeStyle = '#ffffff55';
  ctx.lineWidth = 3;
  ctx.setLineDash([28, 22]);
  ctx.lineDashOffset = -stripeOffset;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();
  ctx.setLineDash([]);
}

// =============================================================
// DRAW: TREES
// =============================================================
function drawTrees() {
  trees.forEach(t => {
    const sy = t.worldY + scrollY;
    if (sy + t.size * 2 < 0 || sy > canvas.height) return;
    // Trunk
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(t.x - 4, sy, 8, t.size * 0.9);
    // Foliage (two layers for depth)
    ctx.fillStyle = '#2d7a2d';
    ctx.beginPath(); ctx.arc(t.x, sy - t.size * 0.2, t.size * 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a9a3a';
    ctx.beginPath(); ctx.arc(t.x - 3, sy - t.size * 0.4, t.size * 0.75, 0, Math.PI * 2); ctx.fill();
  });
}

// =============================================================
// DRAW: HOUSES
// =============================================================
function drawHouses() {
  houses.forEach(h => {
    const sy = h.worldY + scrollY;
    if (sy + HOUSE_H < 0 || sy > canvas.height) return;
    const sx = houseScreenX(h.side);
    const mx = h.side === 'left' ? sx + HOUSE_W : sx - 20;
    const my = sy + HOUSE_H - 22;

    // House body
    ctx.fillStyle = h.delivered ? '#78c878' : '#f4a261';
    ctx.fillRect(sx, sy, HOUSE_W, HOUSE_H);

    // Roof
    ctx.fillStyle = '#9b2226';
    ctx.beginPath();
    ctx.moveTo(sx - 6,           sy);
    ctx.lineTo(sx + HOUSE_W / 2, sy - 30);
    ctx.lineTo(sx + HOUSE_W + 6, sy);
    ctx.closePath(); ctx.fill();

    // Window
    ctx.fillStyle = h.delivered ? '#c8f0c8' : '#a8d0f0';
    ctx.fillRect(sx + 8, sy + 10, 20, 18);
    ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 2;
    ctx.strokeRect(sx + 8, sy + 10, 20, 18);
    // Window cross
    ctx.beginPath();
    ctx.moveTo(sx + 18, sy + 10); ctx.lineTo(sx + 18, sy + 28);
    ctx.moveTo(sx + 8, sy + 19);  ctx.lineTo(sx + 28, sy + 19);
    ctx.stroke();

    // Door
    ctx.fillStyle = '#6b3a2a';
    ctx.fillRect(sx + 32, sy + 36, 22, HOUSE_H - 36);
    ctx.fillStyle = '#f0c040';
    ctx.beginPath(); ctx.arc(sx + 52, sy + 54, 3, 0, Math.PI * 2); ctx.fill();

    // Mailbox — the target
    ctx.fillStyle = h.delivered ? '#78c878' : '#888';
    ctx.fillRect(mx, my, 20, 13);
    ctx.fillStyle = '#555';
    ctx.fillRect(mx + 7, my + 13, 6, 8); // post
  });
}

// =============================================================
// DRAW: OBSTACLES
// =============================================================
function drawObstacles() {
  obstacles.forEach(obs => {
    const sy = obs.worldY + scrollY;
    if (sy + obs.h < 0 || sy > canvas.height) return;

    if (obs.type === 'car') {
      // Car body
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.roundRect(obs.x, sy, obs.w, obs.h, 6);
      ctx.fill();
      // Windshields
      ctx.fillStyle = '#aaddff99';
      ctx.fillRect(obs.x + 5, sy + 12, obs.w - 10, 18);
      ctx.fillRect(obs.x + 5, sy + obs.h - 30, obs.w - 10, 18);
      // Wheels
      ctx.fillStyle = '#111';
      [[-3, 10], [obs.w - 5, 10], [-3, obs.h - 18], [obs.w - 5, obs.h - 18]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(obs.x + dx + 6, sy + dy, 7, 0, Math.PI * 2); ctx.fill();
      });
      // Stripe
      ctx.fillStyle = obs.color2;
      ctx.fillRect(obs.x, sy + obs.h / 2 - 5, obs.w, 10);

    } else if (obs.type === 'dog') {
      // Body
      ctx.fillStyle = obs.color;
      ctx.beginPath(); ctx.ellipse(obs.x + obs.w / 2, sy + obs.h / 2, obs.w / 2, obs.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.beginPath(); ctx.arc(obs.x + obs.w - 4, sy + 6, 10, 0, Math.PI * 2); ctx.fill();
      // Ear
      ctx.fillStyle = obs.color2;
      ctx.beginPath(); ctx.ellipse(obs.x + obs.w, sy + 2, 5, 7, 0.3, 0, Math.PI * 2); ctx.fill();
      // Tail
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(obs.x + 2, sy + obs.h / 2); ctx.quadraticCurveTo(obs.x - 12, sy, obs.x - 8, sy - 8); ctx.stroke();
      // Legs
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 3;
      [[6, obs.h], [14, obs.h + 4], [obs.w - 14, obs.h], [obs.w - 6, obs.h + 4]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(obs.x + dx, sy + obs.h - 4); ctx.lineTo(obs.x + dx, sy + dy); ctx.stroke();
      });

    } else if (obs.type === 'trashcan') {
      // Can body
      ctx.fillStyle = obs.color;
      ctx.beginPath(); ctx.roundRect(obs.x, sy + 6, obs.w, obs.h - 6, [0, 0, 5, 5]); ctx.fill();
      // Lid
      ctx.fillStyle = obs.color2;
      ctx.beginPath(); ctx.ellipse(obs.x + obs.w / 2, sy + 6, obs.w / 2 + 2, 5, 0, 0, Math.PI * 2); ctx.fill();
      // Handle
      ctx.strokeStyle = '#fff5';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(obs.x + obs.w / 2, sy + 6, 5, Math.PI, 0); ctx.stroke();
      // Lines on can
      ctx.strokeStyle = '#fff3';
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(obs.x, sy + 6 + (obs.h - 6) * i / 3);
        ctx.lineTo(obs.x + obs.w, sy + 6 + (obs.h - 6) * i / 3);
        ctx.stroke();
      }

    } else if (obs.type === 'hedgehog') {
      const bx = obs.x + obs.w * 0.42;
      const by = sy + obs.h * 0.62;
      // Warning label above so player can see it coming
      ctx.save();
      ctx.fillStyle = '#ffdd00';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!! -2 ♥', obs.x + obs.w / 2, sy - 6);
      ctx.restore();
      // Spikes (drawn first, lighter color so they stand out on the road)
      ctx.fillStyle = '#c8a96e';
      for (let s = 0; s < 10; s++) {
        const angle = Math.PI + (s / 9) * Math.PI;
        const basex = bx + Math.cos(angle) * obs.w * 0.28;
        const basey = by + Math.sin(angle) * obs.h * 0.26;
        const tipx  = bx + Math.cos(angle) * obs.w * 0.56;
        const tipy  = by + Math.sin(angle) * obs.h * 0.52;
        ctx.beginPath();
        ctx.moveTo(basex - 2.5, basey);
        ctx.lineTo(tipx, tipy);
        ctx.lineTo(basex + 2.5, basey);
        ctx.closePath(); ctx.fill();
      }
      // Body (dark brown)
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.ellipse(bx, by, obs.w * 0.36, obs.h * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Face/snout (warm tan — clearly visible against road)
      ctx.fillStyle = obs.color2;
      ctx.beginPath();
      ctx.ellipse(obs.x + obs.w * 0.78, sy + obs.h * 0.56, obs.w * 0.22, obs.h * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      // Nose
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(obs.x + obs.w * 0.93, sy + obs.h * 0.5, 3, 0, Math.PI * 2); ctx.fill();
      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(obs.x + obs.w * 0.8, sy + obs.h * 0.37, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(obs.x + obs.w * 0.81, sy + obs.h * 0.37, 1.8, 0, Math.PI * 2); ctx.fill();
      // Legs
      ctx.strokeStyle = obs.color2; ctx.lineWidth = 2.5;
      [[0.22, 0.88], [0.40, 0.92], [0.60, 0.88], [0.70, 0.85]].forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.w * rx, sy + obs.h * 0.74);
        ctx.lineTo(obs.x + obs.w * rx, sy + obs.h * ry);
        ctx.stroke();
      });
    }
  });
}

// =============================================================
// DRAW: PLAYER  (more detailed bike + rider)
// =============================================================
function drawPlayer() {
  if (player.invincible > 0 && Math.floor(player.invincible / 6) % 2 === 0) return;

  const ch   = selectedChar || CHARACTERS.lucas;
  const cx   = player.x + player.width / 2;
  const topY = player.y;           // top of the sprite
  const botY = player.y + player.height;

  const frontWheelY = topY + 14;
  const rearWheelY  = botY - 2;
  const WHEEL_R     = 12;

  // ---- WHEELS ----
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(cx, frontWheelY, WHEEL_R, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, rearWheelY,  WHEEL_R, 0, Math.PI * 2); ctx.fill();
  // Spokes
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  for (let a = 0; a < Math.PI; a += Math.PI / 3) {
    for (const wy of [frontWheelY, rearWheelY]) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * WHEEL_R, wy + Math.sin(a) * WHEEL_R);
      ctx.lineTo(cx - Math.cos(a) * WHEEL_R, wy - Math.sin(a) * WHEEL_R);
      ctx.stroke();
    }
  }
  // Hubs
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(cx, frontWheelY, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, rearWheelY,  3, 0, Math.PI * 2); ctx.fill();

  // ---- FRAME ----
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, rearWheelY);
  ctx.lineTo(cx - 4, topY + 35);  // seat tube
  ctx.lineTo(cx, frontWheelY);    // down tube
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, rearWheelY);
  ctx.lineTo(cx + 4, topY + 30);
  ctx.lineTo(cx, frontWheelY);
  ctx.stroke();

  // Handlebar
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 13, topY + 26);
  ctx.lineTo(cx + 13, topY + 26);
  ctx.stroke();

  // Seat
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 10, topY + 37);
  ctx.lineTo(cx + 6,  topY + 37);
  ctx.stroke();

  // ---- RIDER LEGS (animated) ----
  player.color = ch.color;
  player.legAngle += 0.12;
  const legSwing = Math.sin(player.legAngle) * 10;
  ctx.strokeStyle = ch.pants;
  ctx.lineWidth = 4;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(cx - 4, topY + 38);
  ctx.lineTo(cx - 8 + legSwing, topY + 52);
  ctx.lineTo(cx - 4 + legSwing, topY + 58);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(cx + 4, topY + 38);
  ctx.lineTo(cx + 8 - legSwing, topY + 52);
  ctx.lineTo(cx + 4 - legSwing, topY + 58);
  ctx.stroke();

  // ---- RIDER BODY ----
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(cx - 5, topY + 38);   // hips
  ctx.lineTo(cx - 3, topY + 16);   // shoulder
  ctx.lineTo(cx + 9, topY + 24);   // arm to handlebar
  ctx.lineTo(cx + 7, topY + 38);
  ctx.closePath(); ctx.fill();

  // ---- HELMET & HEAD ----
  ctx.fillStyle = ch.skin;
  ctx.beginPath(); ctx.arc(cx - 2, topY + 8, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = ch.helmet;
  ctx.beginPath();
  ctx.arc(cx - 2, topY + 6, 11, Math.PI, 0); // helmet dome
  ctx.fill();
  ctx.fillStyle = ch.visor; // visor stripe
  ctx.fillRect(cx - 13, topY + 6, 22, 4);
}

// =============================================================
// DRAW: NEWSPAPERS
// =============================================================
function drawPapers() {
  ctx.fillStyle = '#f0f0d0';
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  papers.forEach(p => {
    ctx.fillRect(p.x, p.y, 14, 10);
    ctx.strokeRect(p.x, p.y, 14, 10);
    // Rolled-paper line
    ctx.strokeStyle = '#999';
    ctx.beginPath(); ctx.moveTo(p.x + 4, p.y + 2); ctx.lineTo(p.x + 10, p.y + 8); ctx.stroke();
  });
}

// =============================================================
// DRAW: HUD
// =============================================================
function drawHUD() {
  const cfg = getLevelConfig(currentLevel);

  // Semi-transparent bar
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, canvas.width, 78);

  // Left column
  ctx.fillStyle = '#f4a261';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Level ${currentLevel}`, 16, 26);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`Score: ${score}`, 16, 50);
  ctx.fillStyle = '#aaa';
  ctx.font = '13px monospace';
  ctx.fillText(`Best: ${highScore}`, 16, 70);

  // Center — delivery progress
  const delivered = `${levelDelivered} / ${cfg.houses}`;
  ctx.fillStyle = '#90ee90';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Delivered: ${delivered}`, canvas.width / 2, 26);

  // Misses — turns red when close to limit
  const missesLeft = cfg.missLimit - levelMissed;
  ctx.fillStyle = missesLeft <= 1 ? '#ff4444' : '#ffcc66';
  ctx.font = '13px monospace';
  ctx.fillText(`Misses left: ${missesLeft}`, canvas.width / 2, 48);

  // Right column — lives
  ctx.fillStyle = '#ff69b4';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${'♥ '.repeat(Math.max(lives, 0)).trim()}`, canvas.width - 16, 26);

  // Character name
  if (selectedChar) {
    ctx.fillStyle = selectedChar.color;
    ctx.font = '13px monospace';
    ctx.fillText(selectedChar.name, canvas.width - 16, 70);
  }

  ctx.textAlign = 'left';
}

// =============================================================
// DRAW: START SCREEN
// =============================================================
function drawCharSelect() {
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f4a261';
  ctx.font = 'bold 48px monospace';
  ctx.fillText('PAPERBOY', canvas.width / 2, 110);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('Choose your rider', canvas.width / 2, 160);

  // Draw two character cards
  const cards = [
    { key: 'lucas',  label: 'Lucas',  x: canvas.width / 2 - 200, ch: CHARACTERS.lucas  },
    { key: 'matteo', label: 'Matteo', x: canvas.width / 2 + 60,  ch: CHARACTERS.matteo },
  ];

  cards.forEach(card => {
    const cx = card.x + 70;
    const top = 195;

    // Card background
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.roundRect(card.x, top, 140, 200, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mini rider preview — helmet
    ctx.fillStyle = card.ch.skin;
    ctx.beginPath(); ctx.arc(cx, top + 52, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = card.ch.helmet;
    ctx.beginPath(); ctx.arc(cx, top + 49, 18, Math.PI, 0); ctx.fill();
    ctx.fillStyle = card.ch.visor;
    ctx.fillRect(cx - 20, top + 49, 34, 6);
    // Body
    ctx.fillStyle = card.ch.color;
    ctx.beginPath();
    ctx.moveTo(cx - 12, top + 100);
    ctx.lineTo(cx - 8,  top + 70);
    ctx.lineTo(cx + 14, top + 80);
    ctx.lineTo(cx + 10, top + 100);
    ctx.closePath(); ctx.fill();
    // Legs
    ctx.strokeStyle = card.ch.pants; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(cx - 4, top + 100); ctx.lineTo(cx - 8, top + 125); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 4, top + 100); ctx.lineTo(cx + 8, top + 125); ctx.stroke();

    // Name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(card.label, cx, top + 155);

    // Key hint
    ctx.fillStyle = '#aaa';
    ctx.font = '14px monospace';
    ctx.fillText(card.key === 'lucas' ? 'Press  1' : 'Press  2', cx, top + 178);
  });

  ctx.fillStyle = '#888';
  ctx.font = '14px monospace';
  ctx.fillText('Press 1 for Lucas  |  Press 2 for Matteo', canvas.width / 2, 440);
}

function drawStartScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f4a261';
  ctx.font = 'bold 64px monospace';
  ctx.fillText('PAPERBOY', canvas.width / 2, 175);

  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.fillText('Deliver newspapers. Dodge obstacles.', canvas.width / 2, 235);

  ctx.fillStyle = '#ccc';
  ctx.font = '16px monospace';
  ctx.fillText('Arrow keys — move bike', canvas.width / 2, 278);
  ctx.fillText('Spacebar — throw newspaper', canvas.width / 2, 300);
  ctx.fillText('Miss a house = -5 points', canvas.width / 2, 322);

  if (highScore > 0) {
    ctx.fillStyle = '#f4a261';
    ctx.font = '18px monospace';
    ctx.fillText(`Best score: ${highScore}`, canvas.width / 2, 360);
  }

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('Press any key to start', canvas.width / 2, 408);
  ctx.textAlign = 'left';
}

// =============================================================
// DRAW: GAME OVER SCREEN
// =============================================================
function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 58px monospace';
  ctx.fillText('GAME OVER', canvas.width / 2, 185);

  ctx.fillStyle = '#fff';
  ctx.font = '26px monospace';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, 255);

  ctx.fillStyle = '#f4a261';
  ctx.font = '22px monospace';
  ctx.fillText(`Best: ${highScore}`, canvas.width / 2, 295);

  if (score >= highScore && score > 0) {
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, 335);
  }

  ctx.fillStyle = '#aaa';
  ctx.font = '18px monospace';
  ctx.fillText('Press Space to play again', canvas.width / 2, 385);
  ctx.textAlign = 'left';
}

// =============================================================
// DRAW: LEVEL COMPLETE SCREEN
// =============================================================
function drawLevelCompleteScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.80)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#90ee90';
  ctx.font = 'bold 52px monospace';
  ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, 175);

  const cfg = getLevelConfig(currentLevel);
  ctx.fillStyle = '#fff';
  ctx.font = '24px monospace';
  ctx.fillText(`Delivered: ${levelDelivered} / ${cfg.houses}`, canvas.width / 2, 250);
  ctx.fillText(`Missed: ${levelMissed}  (limit: ${cfg.missLimit})`, canvas.width / 2, 285);
  ctx.fillText(`Score: ${score}`, canvas.width / 2, 325);

  ctx.fillStyle = '#f4a261';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`Level ${currentLevel + 1} up next!`, canvas.width / 2, 385);

  ctx.fillStyle = '#aaa';
  ctx.font = '18px monospace';
  ctx.fillText('Press Space to continue', canvas.width / 2, 425);
  ctx.textAlign = 'left';
}

// =============================================================
// DRAW: LEVEL FAILED SCREEN
// =============================================================
function drawLevelFailedScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 52px monospace';
  ctx.fillText('LEVEL FAILED', canvas.width / 2, 175);

  const cfg = getLevelConfig(currentLevel);
  const reason = failReason === 'lives' ? 'You ran out of lives!' : 'Too many missed deliveries!';
  ctx.fillStyle = '#ffcc66';
  ctx.font = '22px monospace';
  ctx.fillText(reason, canvas.width / 2, 235);

  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.fillText(`Delivered: ${levelDelivered} / ${cfg.houses}`, canvas.width / 2, 285);
  ctx.fillText(`Missed: ${levelMissed}  (limit: ${cfg.missLimit})`, canvas.width / 2, 315);
  ctx.fillText(`Score: ${score}`, canvas.width / 2, 350);

  ctx.fillStyle = '#f4a261';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(`Retrying Level ${currentLevel}  —  Lives reset to 3`, canvas.width / 2, 405);

  ctx.fillStyle = '#aaa';
  ctx.font = '18px monospace';
  ctx.fillText('Space — retry    |    R — restart from Level 1', canvas.width / 2, 440);
  ctx.textAlign = 'left';
}

// =============================================================
// UPDATE: SCROLL
// =============================================================
function updateScroll() {
  scrollY      += gameSpeed;
  stripeOffset  = (stripeOffset + gameSpeed) % 50;
}

// =============================================================
// UPDATE: PLAYER
// =============================================================
function updatePlayer() {
  const minX = road.left + 12;
  const maxX = road.right - player.width - 12;
  const minY = 50;
  const maxY = canvas.height - player.height - 10;

  if (keys['ArrowLeft']  && player.x > minX) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < maxX) player.x += player.speed;
  if (keys['ArrowUp']    && player.y > minY) player.y -= player.speed;
  if (keys['ArrowDown']  && player.y < maxY) player.y += player.speed;

  if (player.invincible > 0) player.invincible--;
}

// =============================================================
// UPDATE: THROW
// =============================================================
function handleThrow() {
  if (keys[' '] && paperCooldown <= 0) {
    const cx = player.x + player.width / 2;
    papers.push({ x: cx - 10, y: player.y + 10, vx: -5, vy: -6 });
    papers.push({ x: cx - 4,  y: player.y + 10, vx:  5, vy: -6 });
    paperCooldown = 25;
    playWhoosh();
  }
  if (paperCooldown > 0) paperCooldown--;
}

// =============================================================
// UPDATE: PAPERS
// =============================================================
function updatePapers() {
  for (let i = papers.length - 1; i >= 0; i--) {
    papers[i].x += papers[i].vx;
    papers[i].y += papers[i].vy;

    let hit = false;
    houses.forEach(h => {
      if (hit || h.delivered) return;
      const sy  = h.worldY + scrollY;
      const sx  = houseScreenX(h.side);
      const mx  = h.side === 'left' ? sx + HOUSE_W : sx - 20;
      const my  = sy + HOUSE_H - 22;
      const p   = papers[i];
      if (p && p.x + 14 > mx && p.x < mx + 20 &&
               p.y + 10 > my && p.y < my + 13) {
        h.delivered = true;
        papers.splice(i, 1);
        score += 10;
        levelDelivered++;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('paperboy_hs', highScore);
        }
        addFloat('+10', mx + 10, my - 10, '#90ee90');
        playDing();
        checkLevelEnd();
        hit = true;
      }
    });

    if (!hit && papers[i] &&
       (papers[i].y < -20 || papers[i].x < -20 || papers[i].x > canvas.width + 20)) {
      papers.splice(i, 1);
    }
  }
}

// =============================================================
// UPDATE: OBSTACLE COLLISIONS
// =============================================================
function checkCollisions() {
  if (player.invincible > 0) return;
  obstacles.forEach(obs => {
    const sy = obs.worldY + scrollY;
    if (
      player.x + player.width  > obs.x + 4       &&
      player.x + 4             < obs.x + obs.w - 4 &&
      player.y + player.height > sy + 4           &&
      player.y + 10            < sy + obs.h - 4
    ) {
      lives -= (obs.livesLost || 1);
      player.invincible = 120;
      const crashMsg = obs.type === 'hedgehog' ? 'OUCH! -2 ♥' : 'CRASH!';
      addFloat(crashMsg, player.x + player.width / 2, player.y - 10, '#ff4444');
      if (obs.type === 'hedgehog') playHedgehogHit(); else playCrash();
      if (lives <= 0) {
        if (score > highScore) { highScore = score; localStorage.setItem('paperboy_hs', highScore); }
        failReason = 'lives';
        gameState  = 'levelfailed';
      }
    }
  });
}

// =============================================================
// GAME LOOP
// =============================================================
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'charselect') {
    drawBackground();
    drawTrees();
    drawCharSelect();

  } else if (gameState === 'start') {
    drawBackground();
    drawTrees();
    drawStartScreen();

  } else if (gameState === 'playing') {
    updateDifficulty();
    updateScroll();
    updatePlayer();
    handleThrow();
    updatePapers();
    updateHouses();
    recycleTrees();
    recycleObstacles();
    recycleHearts();
    updateLizards();
    checkCollisions();
    checkLizardCollisions();
    checkHeartCollisions();
    updateFloats();

    drawBackground();
    drawTrees();
    drawHouses();
    drawHearts();
    drawObstacles();
    drawLizards();
    drawPapers();
    drawPlayer();
    drawHUD();
    drawFloats();

  } else if (gameState === 'levelcomplete') {
    drawBackground();
    drawTrees();
    drawHouses();
    drawObstacles();
    drawPlayer();
    drawHUD();
    drawLevelCompleteScreen();

  } else if (gameState === 'levelfailed') {
    drawBackground();
    drawTrees();
    drawHouses();
    drawObstacles();
    drawPlayer();
    drawHUD();
    drawLevelFailedScreen();

  } else if (gameState === 'gameover') {
    drawBackground();
    drawTrees();
    drawHouses();
    drawObstacles();
    drawPlayer();
    drawHUD();
    drawGameOverScreen();
  }

  requestAnimationFrame(gameLoop);
}

// =============================================================
// INIT
// =============================================================
setupLevel(1);
gameLoop();

// =============================================================
// FULLSCREEN
// =============================================================
const fsBtn     = document.getElementById('fullscreen-btn');
const gameWrap  = document.getElementById('game-wrapper');

function scaleForFullscreen() {
  const scaleX = window.innerWidth  / canvas.width;
  const scaleY = window.innerHeight / canvas.height;
  const scale  = Math.min(scaleX, scaleY) * 0.97;
  canvas.style.transform       = `scale(${scale})`;
  canvas.style.transformOrigin = 'center center';
}

function clearScale() {
  canvas.style.transform       = '';
  canvas.style.transformOrigin = '';
}

fsBtn.addEventListener('click', () => {
  fsBtn.blur(); // stop the button keeping focus so Space doesn't re-trigger it
  if (!document.fullscreenElement) {
    gameWrap.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    scaleForFullscreen();
    fsBtn.textContent = '✕ Exit fullscreen';
  } else {
    clearScale();
    fsBtn.textContent = '⛶ Fullscreen';
  }
});

window.addEventListener('resize', () => {
  if (document.fullscreenElement) scaleForFullscreen();
});
