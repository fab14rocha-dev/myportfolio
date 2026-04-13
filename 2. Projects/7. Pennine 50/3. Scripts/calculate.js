const fs = require('fs');

const gpx = fs.readFileSync('./Pennine Barrier 50 Mile - Pennine Barrier Ultra - 3 Apr 26 - Racemap Studio.gpx', 'utf8');

// Parse all trackpoints
const points = [];
const trkptRegex = /<trkpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>/g;
let match;
while ((match = trkptRegex.exec(gpx)) !== null) {
  points.push({ lat: parseFloat(match[1]), lon: parseFloat(match[2]), ele: parseFloat(match[3]) });
}

// Haversine distance in km
function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.asin(Math.sqrt(s));
}

// Accumulate cumulative distance and elevation gain
let cumDist = 0;
const track = [{ cumDist: 0, ele: points[0].ele }];
for (let i = 1; i < points.length; i++) {
  cumDist += haversine(points[i-1], points[i]);
  track.push({ cumDist, ele: points[i].ele });
}

console.log(`Total track distance: ${cumDist.toFixed(2)} km`);

// Checkpoint cumulative distances
const checkpoints = [
  { name: 'Start',                  km: 0.0  },
  { name: 'CP1 - Silverdale Road',  km: 18.9 },
  { name: 'CP2 - Ribblehead',       km: 33.1 },
  { name: 'CP3 - Philpin Farm',     km: 43.5 },
  { name: 'CP4 - Horton',           km: 55.2 },
  { name: 'CP5 - Silverdale Return',km: 60.8 },
  { name: 'Finish',                 km: 79.0 },
];

// Find the track index closest to a given cumulative distance
function findIndex(targetKm) {
  let best = 0, bestDiff = Infinity;
  for (let i = 0; i < track.length; i++) {
    const diff = Math.abs(track[i].cumDist - targetKm);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  }
  return best;
}

// Calculate elevation gain between two track indices
function elevGain(fromIdx, toIdx) {
  let gain = 0;
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    const diff = track[i].ele - track[i-1].ele;
    if (diff > 0) gain += diff;
  }
  return Math.round(gain);
}

// Get indices for each checkpoint
const indices = checkpoints.map(cp => findIndex(cp.km));

// Calculate leg stats
const legs = [];
for (let i = 1; i < checkpoints.length; i++) {
  const legDist = checkpoints[i].km - checkpoints[i-1].km;
  const ascent  = elevGain(indices[i-1], indices[i]);
  legs.push({ from: checkpoints[i-1].name, to: checkpoints[i].name, dist: legDist, ascent });
}

console.log('\n--- Leg Elevation Gains ---');
legs.forEach(l => console.log(`${l.from} → ${l.to}: ${l.dist} km, +${l.ascent}m`));

// Naismith's Rule: difficulty = dist_km/5 + ascent_m/600 (in hours)
const naismith = legs.map(l => l.dist / 5 + l.ascent / 600);

// Fatigue multipliers per leg (legs get harder as you tire)
const fatigue = [1.0, 1.0, 1.0, 1.10, 1.10, 1.15];
const adjusted = naismith.map((n, i) => n * fatigue[i]);

const totalAdjusted = adjusted.reduce((a, b) => a + b, 0);
const TARGET_HOURS = 12;
const scale = TARGET_HOURS / totalAdjusted;

console.log(`\nTotal adjusted hours: ${totalAdjusted.toFixed(2)}, scale factor: ${scale.toFixed(3)}`);

// Calculate arrival times
const START_MINUTES = 6 * 60; // 06:00
function toTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.round(mins % 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

console.log('\n--- Target Arrival Times (with fatigue) ---');
let elapsed = 0;
checkpoints.forEach((cp, i) => {
  if (i === 0) {
    console.log(`${cp.name}: 06:00 (Start)`);
    return;
  }
  const legMins = adjusted[i-1] * scale * 60;
  elapsed += legMins;
  console.log(`${cp.name}: ${toTime(START_MINUTES + elapsed)} (leg: ${legMins.toFixed(0)} min, +${legs[i-1].ascent}m, fatigue x${fatigue[i-1]})`);
});
