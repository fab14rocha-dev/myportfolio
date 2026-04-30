'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const W = canvas.width;   // 900
const H = canvas.height;  // 580

// ── Camera / projection ───────────────────────────────────────────────────────
// At depth z, a world point at lateral position xWorld (range -0.5 to +0.5)
// maps to a screen x that shifts relative to the player's position.
const HORIZON_Y = Math.round(H * 0.42); // y of vanishing point
const NEAR_Z    = 90;   // depth at which road fills full screen width
const DRAW_DIST = 700;  // how far ahead (world units) to render

// Y on screen for something at depth z (road-level)
function projY(z) {
  return HORIZON_Y + (NEAR_Z / Math.max(z, 0.1)) * (H - HORIZON_Y);
}
// X on screen for object at depth z with world xWorld, when player is at xPlayer
function projX(z, xWorld, xPlayer) {
  return W / 2 + (xWorld - xPlayer) * (NEAR_Z / Math.max(z, 0.1)) * W;
}
// Half-width of the road on screen at depth z
function roadHalf(z) {
  return 0.5 * (NEAR_Z / Math.max(z, 0.1)) * W;
}

// ── Game constants ────────────────────────────────────────────────────────────
const TRACK_LEN  = 3000;  // world units per lap
const TOTAL_LAPS = 3;
const NUM_BIKES  = 10;
const SEG_LEN    = 150;   // alternating road stripe length (world units)
const BASE_SPD   = 0.22;  // world units per ms

const BIKE_COLORS = [
  '#5533FF', // Player — Indigo
  '#3388FF', // Blue
  '#33DD33', // Green
  '#FF9900', // Orange
  '#FF44EE', // Pink
  '#00DDDD', // Cyan
  '#FFEE00', // Yellow
  '#FF2222', // Red
  '#FF6688', // Rose
  '#00FF99', // Mint
];
const BIKE_NAMES = ['YOU','Blue','Green','Orange','Pink','Cyan','Yellow','Red','Rose','Mint'];

// ── State ─────────────────────────────────────────────────────────────────────
let bikes, pickups, finishOrder, gameState, countdown, cdTimer, lastTs;

function ordinal(n) {
  const v = n % 100;
  return n + (['th','st','nd','rd'][(v - 20) % 10] || ['th','st','nd','rd'][v] || 'th');
}

function initGame() {
  bikes = Array.from({ length: NUM_BIKES }, (_, i) => ({
    i,
    isPlayer: i === 0,
    name:     BIKE_NAMES[i],
    color:    BIKE_COLORS[i],
    // Player starts last; AI bikes spread ahead
    dist:     i === 0 ? 0 : 30 + Math.random() * 270,
    speed:    BASE_SPD + (Math.random() - 0.5) * BASE_SPD * 0.2,
    xPos:     i === 0 ? 0 : (Math.random() - 0.5) * 0.6,
    xTarget:  (Math.random() - 0.5) * 0.5,
    lap:      0,
    finished: false,
    effect:   null,  // { type: 'boost'|'slow', until: timestamp }
  }));

  // Scatter pickups along the first lap
  pickups = [];
  const dists = [250, 480, 700, 950, 1200, 1450, 1650, 1900, 2200];
  const types = ['heart','heart','heart','heart','heart','bomb','bomb','bomb','bomb'];
  dists.forEach((d, i) => {
    pickups.push({ type: types[i], dist: d, xPos: (Math.random() - 0.5) * 0.65, active: true });
  });

  finishOrder = [];
  gameState   = 'countdown';
  countdown   = 3;
  cdTimer     = 0;
  lastTs      = null;
}

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
    e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

// ── Update ────────────────────────────────────────────────────────────────────
function update(now, dt) {
  const player = bikes[0];

  bikes.forEach(bike => {
    if (bike.finished) return;

    // Speed multiplier from heart/bomb effects
    let mult = 1;
    if (bike.effect) {
      if (now < bike.effect.until) mult = bike.effect.type === 'boost' ? 1.6 : 0.4;
      else bike.effect = null;
    }

    if (bike.isPlayer) {
      let spd = bike.speed;
      if (keys['ArrowUp']   || keys['w'] || keys['W']) spd *= 1.45;
      if (keys['ArrowDown'] || keys['s'] || keys['S']) spd *= 0.15;
      bike.dist += spd * mult * dt;

      const str = 0.0012 * dt;
      if (keys['ArrowLeft']  || keys['a'] || keys['A']) bike.xPos = Math.max(-0.44, bike.xPos - str);
      if (keys['ArrowRight'] || keys['d'] || keys['D']) bike.xPos = Math.min( 0.44, bike.xPos + str);
    } else {
      bike.dist += bike.speed * mult * (0.9 + Math.random() * 0.2) * dt;
      // Drift toward lane target
      bike.xPos += (bike.xTarget - bike.xPos) * 0.008;
      if (Math.random() < 0.003) bike.xTarget = (Math.random() - 0.5) * 0.6;
    }

    // Lap counting
    const newLap = Math.floor(bike.dist / TRACK_LEN);
    if (newLap > bike.lap) {
      bike.lap = newLap;
      if (bike.lap >= TOTAL_LAPS && !bike.finished) {
        bike.finished = true;
        finishOrder.push(bike);
        if (bike.isPlayer || finishOrder.length === NUM_BIKES) endRace();
      }
    }
  });

  // Pickup collision (player only)
  pickups.forEach(p => {
    if (!p.active) return;
    const relDist = p.dist - player.dist;

    // Player already passed it without collecting → respawn ahead
    if (relDist < -50) {
      p.dist = player.dist + 250 + Math.random() * 600;
      p.xPos = (Math.random() - 0.5) * 0.7;
      return;
    }

    // Collect if within range
    if (relDist > 0 && relDist < 35 && Math.abs(player.xPos - p.xPos) < 0.14) {
      p.active = false;
      player.effect = {
        type:  p.type === 'heart' ? 'boost' : 'slow',
        until: now + (p.type === 'heart' ? 3000 : 2000),
      };
      setTimeout(() => {
        p.active = true;
        p.dist   = player.dist + 300 + Math.random() * 600;
        p.xPos   = (Math.random() - 0.5) * 0.7;
      }, 5000);
    }
  });
}

function endRace() {
  bikes.filter(b => !b.finished)
    .sort((a, b) => b.dist - a.dist)
    .forEach(b => { b.finished = true; finishOrder.push(b); });
  gameState = 'finished';
}

// ── Drawing ───────────────────────────────────────────────────────────────────
function drawSky() {
  const grad = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
  grad.addColorStop(0, '#1a3a88');
  grad.addColorStop(1, '#6699cc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, HORIZON_Y);

  // Hills silhouette
  ctx.fillStyle = '#2a5e2a';
  ctx.beginPath();
  ctx.moveTo(0, HORIZON_Y);
  for (let x = 0; x <= W; x += 25) {
    ctx.lineTo(x, HORIZON_Y - 22 * Math.sin(x * 0.011) - 12 * Math.sin(x * 0.029));
  }
  ctx.lineTo(W, HORIZON_Y);
  ctx.closePath();
  ctx.fill();
}

function drawRoad(playerDist, playerX) {
  const N = 100;

  for (let i = 0; i < N; i++) {
    // Render far → near so near strips overdraw far ones
    const zFar  = DRAW_DIST - (i / N) * (DRAW_DIST - NEAR_Z);
    const zNear = DRAW_DIST - ((i + 1) / N) * (DRAW_DIST - NEAR_Z);

    const yFar  = projY(zFar);
    const yNear = projY(zNear);

    if (yFar > H || yNear < HORIZON_Y) continue;
    const yF = Math.max(HORIZON_Y, yFar);
    const yN = Math.min(H, yNear);

    // Road center shifts with playerX (camera follows player laterally)
    const roadCxFar  = W / 2 - playerX * (NEAR_Z / zFar)  * W;
    const roadCxNear = W / 2 - playerX * (NEAR_Z / zNear) * W;

    const rwFar  = roadHalf(zFar);
    const rwNear = roadHalf(zNear);

    // Alternating stripe colour based on world position
    const stripe = Math.floor((playerDist + zFar) / SEG_LEN) % 2 === 0;

    // Grass (full strip)
    ctx.fillStyle = stripe ? '#2d7a2d' : '#246624';
    ctx.fillRect(0, yF, W, yN - yF);

    // Road surface
    ctx.fillStyle = stripe ? '#5c5c5c' : '#686868';
    ctx.beginPath();
    ctx.moveTo(roadCxFar  - rwFar,  yF);
    ctx.lineTo(roadCxFar  + rwFar,  yF);
    ctx.lineTo(roadCxNear + rwNear, yN);
    ctx.lineTo(roadCxNear - rwNear, yN);
    ctx.closePath();
    ctx.fill();

    // Road edge lines
    const ew = Math.max(1.5, (NEAR_Z / zNear) * 2.5);
    ctx.lineWidth   = ew;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath(); ctx.moveTo(roadCxFar - rwFar, yF); ctx.lineTo(roadCxNear - rwNear, yN); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(roadCxFar + rwFar, yF); ctx.lineTo(roadCxNear + rwNear, yN); ctx.stroke();

    // Dashed centre line
    if (stripe) {
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth   = Math.max(1, (NEAR_Z / zNear) * 1.5);
      ctx.beginPath();
      ctx.moveTo(roadCxFar,  yF);
      ctx.lineTo(roadCxNear, yN);
      ctx.stroke();
    }
  }
}

function drawSprites(playerDist, playerX, now) {
  // Build list of visible objects, sorted far → near
  const objs = [];

  bikes.forEach(bike => {
    if (bike.isPlayer) return;
    const relDist = bike.dist - playerDist;
    if (relDist <= 0 || relDist > DRAW_DIST) return;
    objs.push({ kind: 'bike', z: relDist, xPos: bike.xPos, ref: bike });
  });

  pickups.forEach(p => {
    if (!p.active) return;
    const relDist = p.dist - playerDist;
    if (relDist <= 0 || relDist > DRAW_DIST) return;
    objs.push({ kind: 'pickup', z: relDist, xPos: p.xPos, ref: p });
  });

  objs.sort((a, b) => b.z - a.z);

  objs.forEach(obj => {
    const sx = projX(obj.z, obj.xPos, playerX);
    const sy = projY(obj.z);
    const sc = NEAR_Z / obj.z; // scale factor

    if (sy < HORIZON_Y - 5 || sy > H + 100) return;

    if (obj.kind === 'bike') {
      const bw = Math.max(6, 55 * sc);
      const bh = Math.max(8, 88 * sc);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(sx, sy, bw * 0.55, bh * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = obj.ref.color;
      ctx.beginPath();
      ctx.moveTo(sx - bw * 0.48, sy);               // bottom-left
      ctx.lineTo(sx + bw * 0.48, sy);               // bottom-right
      ctx.lineTo(sx + bw * 0.32, sy - bh * 0.65);  // upper-right
      ctx.lineTo(sx - bw * 0.32, sy - bh * 0.65);  // upper-left
      ctx.closePath();
      ctx.fill();

      // Windshield
      ctx.fillStyle = 'rgba(180,220,255,0.55)';
      ctx.fillRect(sx - bw * 0.22, sy - bh * 0.65, bw * 0.44, bh * 0.22);

      // Helmet (rider)
      ctx.fillStyle = '#222222';
      ctx.beginPath();
      ctx.arc(sx, sy - bh * 0.78, bw * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Wheel hint at bottom
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.ellipse(sx, sy - bh * 0.04, bw * 0.25, bh * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Pickup (heart / bomb)
      const pulse = 0.82 + 0.18 * Math.sin(now / 320);
      const sz    = Math.max(10, 30 * sc * pulse);
      ctx.font         = `${sz}px Arial`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.ref.type === 'heart' ? '❤️' : '💣', sx, sy);
    }
  });
}

function drawPlayerBike(player, now) {
  // Player bike is always centered horizontally (camera follows player)
  const bx = W / 2;
  const by = H - 15;
  const bw = 72;
  const bh = 110;

  // Glow for active effect
  if (player.effect) {
    ctx.shadowColor = player.effect.type === 'boost' ? '#FFD700' : '#4499FF';
    ctx.shadowBlur  = 22;
  }

  // Rear wheel
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.ellipse(bx, by - bh * 0.1, bw * 0.48, bh * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.lineWidth   = 2;
  ctx.stroke();
  // Rim detail
  ctx.strokeStyle = '#888';
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(bx - bw * 0.48, by - bh * 0.1); ctx.lineTo(bx + bw * 0.48, by - bh * 0.1); ctx.stroke();

  // Bike body (trapezoid — wider at bottom)
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(bx - bw * 0.48, by - bh * 0.18);  // bottom-left
  ctx.lineTo(bx + bw * 0.48, by - bh * 0.18);  // bottom-right
  ctx.lineTo(bx + bw * 0.30, by - bh * 0.68);  // upper-right
  ctx.lineTo(bx - bw * 0.30, by - bh * 0.68);  // upper-left
  ctx.closePath();
  ctx.fill();

  // Windshield
  ctx.fillStyle = 'rgba(180,220,255,0.5)';
  ctx.beginPath();
  ctx.moveTo(bx - bw * 0.26, by - bh * 0.68);
  ctx.lineTo(bx + bw * 0.26, by - bh * 0.68);
  ctx.lineTo(bx + bw * 0.20, by - bh * 0.55);
  ctx.lineTo(bx - bw * 0.20, by - bh * 0.55);
  ctx.closePath();
  ctx.fill();

  // Rider body
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.ellipse(bx, by - bh * 0.78, bw * 0.22, bh * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Helmet
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(bx, by - bh * 0.88, bw * 0.22, 0, Math.PI * 2);
  ctx.fill();
  // Visor
  ctx.fillStyle = 'rgba(180,220,255,0.45)';
  ctx.beginPath();
  ctx.arc(bx, by - bh * 0.88, bw * 0.16, Math.PI * 1.1, Math.PI * 1.9);
  ctx.fill();

  // Front fork / wheel (peeking at very bottom)
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.ellipse(bx, by - 5, bw * 0.28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}

function drawHUD(now) {
  const player = bikes[0];
  const sorted = [...bikes].sort((a, b) => b.dist - a.dist);
  const pos    = sorted.findIndex(b => b.isPlayer) + 1;

  // Panel
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.beginPath();
  ctx.roundRect(12, 12, 178, 95, 8);
  ctx.fill();

  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle    = '#FFFFFF';
  ctx.font         = 'bold 15px monospace';
  ctx.fillText(`Lap:  ${Math.min(player.lap + 1, TOTAL_LAPS)} / ${TOTAL_LAPS}`, 22, 22);
  ctx.fillText(`Pos:  ${ordinal(pos)} of ${NUM_BIKES}`, 22, 46);

  if (player.effect) {
    ctx.fillStyle = player.effect.type === 'boost' ? '#FFD700' : '#88BBFF';
    ctx.font      = 'bold 14px Arial';
    ctx.fillText(player.effect.type === 'boost' ? '⚡  BOOST!' : '💥  SLOWED!', 22, 72);
  }

  // Controls hint
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath();
  ctx.roundRect(12, H - 48, 285, 36, 6);
  ctx.fill();
  ctx.fillStyle    = '#888';
  ctx.font         = '11px Arial';
  ctx.textBaseline = 'top';
  ctx.fillText('↑/W = speed up    ↓/S = brake    ←/→ = steer', 20, H - 38);
}

function drawCountdown() {
  ctx.fillStyle = 'rgba(0,0,0,0.52)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#FFD700';
  ctx.font         = 'bold 110px Arial';
  ctx.fillText(countdown > 0 ? countdown : 'GO!', W / 2, H / 2);
}

function drawFinished() {
  ctx.fillStyle = 'rgba(0,0,0,0.80)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle    = '#FFD700';
  ctx.font         = 'bold 48px Arial';
  ctx.fillText('RACE FINISHED!', W / 2, 50);

  const medals = ['🥇', '🥈', '🥉'];
  finishOrder.forEach((bike, i) => {
    ctx.fillStyle = bike.isPlayer ? '#88FFAA' : (i < 3 ? '#FFD700' : '#CCCCCC');
    ctx.font      = `${i < 3 ? 'bold ' : ''}18px Arial`;
    const label   = i < 3 ? medals[i] : `${i + 1}.`;
    ctx.fillText(`${label}  ${bike.name}`, W / 2, 122 + i * 32);
  });

  ctx.fillStyle    = '#666';
  ctx.font         = '14px Arial';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Press SPACE or click to race again', W / 2, H - 22);
}

// ── Game loop ─────────────────────────────────────────────────────────────────
function loop(now) {
  const dt = lastTs ? Math.min(now - lastTs, 50) : 0;
  lastTs   = now;

  const player = bikes[0];

  drawSky();
  drawRoad(player.dist, player.xPos);
  drawSprites(player.dist, player.xPos, now);
  drawPlayerBike(player, now);

  if (gameState === 'countdown') {
    cdTimer += dt;
    if (cdTimer >= 1000) {
      cdTimer = 0;
      countdown--;
      if (countdown < 0) gameState = 'racing';
    }
    drawCountdown();
  } else if (gameState === 'racing') {
    update(now, dt);
    drawHUD(now);
  } else if (gameState === 'finished') {
    drawHUD(now);
    drawFinished();
    if (keys[' '] || keys['Enter']) initGame();
  }

  requestAnimationFrame(loop);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
canvas.addEventListener('click', () => {
  if (gameState === 'finished') initGame();
});

initGame();
requestAnimationFrame(loop);
