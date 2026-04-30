import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Nunito';

const { fontFamily } = loadFont('normal', { weights: ['800'] });

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG     = '#07070A';
const BLUE   = '#00C8FF';
const PURPLE = '#9945FF';
const CORAL  = '#FF4060';
const WHITE  = '#FFFFFF';

// ─── Seeded random — must be deterministic (no Math.random in Remotion) ───────
const rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const cf = (frame, i, o) => interpolate(frame, i, o, clamp);

// ─── Timeline (300f = 10s at 30fps) ──────────────────────────────────────────
//  0  – 45   Scan line sweeps top → bottom
//  38 – 135  Dot grid ripples in from centre outward
//  95 – 195  Four words slam in from N/S/E/W
// 165 – 200  Peak — dots pulse, words glow
// 200 – 235  Everything clears
// 240 – 300  Typewriter finale + tagline
const F = {
  SCAN_END:     45,
  DOTS_START:   38,
  DOTS_CLEAR:   215,
  WORDS_START:  95,
  WORDS_CLEAR:  205,
  SHAPES_CLEAR: 225,
  FINALE:       240,
  TAG:          295,
  END:          300,
};

// ─── Dot grid: 7 cols × 11 rows = 77 dots ────────────────────────────────────
const W = 1080, H = 1920;
const COLS = 7, ROWS = 11;

const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const dist = Math.sqrt((c - (COLS - 1) / 2) ** 2 + (r - (ROWS - 1) / 2) ** 2);
  const t = rand(i * 3);
  return {
    i, c, r,
    x: (c + 1) * W / (COLS + 1),
    y: (r + 1) * H / (ROWS + 1),
    dist,
    delay:  F.DOTS_START + Math.round(dist * 5),
    size:   5 + rand(i * 3 + 1) * 6,
    color:  t > 0.62 ? BLUE : t > 0.34 ? PURPLE : 'rgba(255,255,255,0.10)',
    phase:  rand(i * 3 + 2) * Math.PI * 2,
  };
});

// ─── Four words with slam directions ─────────────────────────────────────────
// Positions are offsets from screen centre (540, 960)
const WORDS = [
  { text: 'SPRING',  fromX: -1000, fromY: 0,     toX: -290, toY: -370, delay: F.WORDS_START,      color: BLUE,   size: 100 },
  { text: 'PHYSICS', fromX:  1000, fromY: 0,     toX:  200, toY: -190, delay: F.WORDS_START + 10, color: WHITE,  size: 82  },
  { text: 'SMOOTH',  fromX: 0,     fromY: -1000, toX: -170, toY:  80,  delay: F.WORDS_START + 20, color: PURPLE, size: 90  },
  { text: 'PRECISE', fromX: 0,     fromY:  1000, toX:  160, toY:  340, delay: F.WORDS_START + 30, color: CORAL,  size: 86  },
];

// ─── Background wireframe shapes ─────────────────────────────────────────────
const SHAPES = [
  { size: 420, x: 160,  y: 380,  color: BLUE,   dir:  1, isCircle: true  },
  { size: 360, x: 920,  y: 580,  color: PURPLE, dir: -1, isCircle: false },
  { size: 500, x: 540,  y: 960,  color: CORAL,  dir:  1, isCircle: false },
  { size: 340, x: 200,  y: 1480, color: PURPLE, dir: -1, isCircle: true  },
  { size: 380, x: 880,  y: 1640, color: BLUE,   dir:  1, isCircle: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const CapabilitiesDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = W / 2; // 540
  const cy = H / 2; // 960

  // ── Scan line ──
  const scanY       = cf(frame, [0, F.SCAN_END], [-4, H + 4]);
  const scanOpacity = cf(frame, [0, 6, F.SCAN_END - 6, F.SCAN_END], [0, 1, 1, 0]);

  // ── Global opacities ──
  const dotsOpacity   = cf(frame, [F.DOTS_CLEAR,  F.DOTS_CLEAR  + 20], [1, 0]);
  const wordsOpacity  = cf(frame, [F.WORDS_CLEAR, F.WORDS_CLEAR + 25], [1, 0]);
  const shapesOpacity = cf(frame, [F.SHAPES_CLEAR, F.SHAPES_CLEAR + 20], [1, 0])
                      * cf(frame, [F.DOTS_START, F.DOTS_START + 30], [0, 1]);

  // ── Finale ──
  const finaleText    = 'ANYTHING.';
  const chars         = Math.floor(cf(frame, [F.FINALE, F.FINALE + 40], [0, finaleText.length]));
  const finaleOpacity = cf(frame, [F.FINALE, F.FINALE + 10], [0, 1]);
  const tagOpacity    = cf(frame, [F.FINALE + 55, F.FINALE + 75], [0, 1]);
  const finaleSpring  = spring({ frame: Math.max(0, frame - F.FINALE), fps, config: { damping: 22, stiffness: 80 }, durationInFrames: 40 });
  const finaleScale   = interpolate(finaleSpring, [0, 1], [0.88, 1]);

  // ── Peak pulse helper ──
  const isPeak = frame > 165 && frame < F.WORDS_CLEAR;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily, overflow: 'hidden' }}>

      {/* ── Wireframe shapes (background) ── */}
      <AbsoluteFill style={{ opacity: shapesOpacity }}>
        {SHAPES.map((s, i) => {
          const rot = frame * 0.25 * s.dir + i * 37;
          return (
            <div key={i} style={{
              position: 'absolute',
              left:   s.x - s.size / 2,
              top:    s.y - s.size / 2,
              width:  s.size,
              height: s.size,
              borderRadius: s.isCircle ? '50%' : '14px',
              border: `2px solid ${s.color}`,
              opacity: 0.09,
              transform: `rotate(${rot}deg)`,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* ── Dot grid ── */}
      <AbsoluteFill style={{ opacity: dotsOpacity }}>
        {DOTS.map((dot) => {
          const age = Math.max(0, frame - dot.delay);
          const sp  = spring({ frame: age, fps, config: { damping: 13, stiffness: 200 }, durationInFrames: 14 });
          const pulse = isPeak
            ? Math.sin(frame * 0.18 + dot.phase) * 0.28 + 0.72
            : 1;
          return (
            <div key={dot.i} style={{
              position: 'absolute',
              left:         dot.x - dot.size / 2,
              top:          dot.y - dot.size / 2,
              width:        dot.size,
              height:       dot.size,
              borderRadius: '50%',
              background:   dot.color,
              opacity:      sp * pulse,
              transform:    `scale(${sp})`,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* ── Cross-hair ring at peak ── */}
      {isPeak && (() => {
        const ringAge = Math.max(0, frame - 165);
        const ringSp  = spring({ frame: ringAge, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 30 });
        const ringScale = interpolate(ringSp, [0, 1], [0.3, 1]);
        const ringOpacity = cf(frame, [165, 175, F.WORDS_CLEAR - 10, F.WORDS_CLEAR + 10], [0, 0.35, 0.35, 0]);
        return (
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ringOpacity }}>
            <div style={{
              width: 600, height: 600,
              borderRadius: '50%',
              border: `1.5px solid ${BLUE}`,
              transform: `scale(${ringScale})`,
            }} />
          </AbsoluteFill>
        );
      })()}

      {/* ── Words slamming in ── */}
      <AbsoluteFill style={{ opacity: wordsOpacity }}>
        {WORDS.map((w, i) => {
          const age = Math.max(0, frame - w.delay);
          // No clamp on interpolate — spring overshoot gives the satisfying slam
          const sp  = spring({ frame: age, fps, config: { damping: 15, stiffness: 110 }, durationInFrames: 35 });
          const x   = cx + interpolate(sp, [0, 1], [w.fromX, w.toX]);
          const y   = cy + interpolate(sp, [0, 1], [w.fromY, w.toY]);
          const glow = isPeak ? `0 0 50px ${w.color}66` : `0 0 24px ${w.color}33`;
          return (
            <div key={i} style={{
              position:  'absolute',
              left:      x,
              top:       y,
              transform: 'translate(-50%, -50%)',
              opacity:   sp > 0.01 ? 1 : 0,
              fontSize:  w.size,
              fontWeight: 800,
              color:     w.color,
              letterSpacing: '-2px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textShadow: glow,
              userSelect: 'none',
            }}>
              {w.text}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ── Scan line ── */}
      <div style={{
        position: 'absolute',
        left:     0,
        top:      scanY,
        width:    '100%',
        height:   3,
        background: `linear-gradient(90deg, transparent 0%, ${BLUE} 30%, ${WHITE} 50%, ${BLUE} 70%, transparent 100%)`,
        opacity:  scanOpacity,
        boxShadow: `0 0 18px ${BLUE}, 0 0 60px ${BLUE}55`,
      }} />

      {/* ── Finale ── */}
      <AbsoluteFill style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        opacity:        finaleOpacity,
        transform:      `scale(${finaleScale})`,
      }}>
        {/* Typewriter headline */}
        <p style={{
          fontSize:      120,
          fontWeight:    800,
          color:         WHITE,
          letterSpacing: '-4px',
          lineHeight:    1,
          margin:        '0 0 36px',
          textAlign:     'center',
          width:         '85%',
        }}>
          {finaleText.slice(0, chars)}
          {/* invisible spacer keeps layout stable while typing */}
          <span style={{ opacity: 0 }}>{finaleText.slice(chars)}</span>
        </p>

        {/* Tagline */}
        <p style={{
          fontSize:      28,
          fontWeight:    800,
          color:         BLUE,
          letterSpacing: 7,
          margin:        0,
          opacity:       tagOpacity,
          textAlign:     'center',
        }}>
          WITH REMOTION + CLAUDE
        </p>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
