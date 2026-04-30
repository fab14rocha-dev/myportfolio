import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Nunito';

const { fontFamily } = loadFont('normal', { weights: ['700', '800'] });

const BG = '#1c1c1c';
const TEXT_COLOR = '#ffffff';
const CHECK_COLOR = '#5AB4D8';
const X_COLOR = '#D95555';
const BORDER_COLOR = '#3c3c3c';
const CELL_BG = '#242424';
const CELL_SIZE = 80;

// Deterministic pseudo-random (no Math.random — Remotion renders must be pure)
const rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// 5x5 grid filled left-to-right, top-to-bottom
// 12 frames per cell (~0.4s each), starting at frame 30
const GRID_CELLS = [
  // Row 1 — all checks
  { type: 'check', frame: 30  },
  { type: 'check', frame: 42  },
  { type: 'check', frame: 54  },
  { type: 'check', frame: 66  },
  { type: 'check', frame: 78  },
  // Row 2 — all checks
  { type: 'check', frame: 90  },
  { type: 'check', frame: 102 },
  { type: 'check', frame: 114 },
  { type: 'check', frame: 126 },
  { type: 'check', frame: 138 },
  // Row 3 — mix starts
  { type: 'check', frame: 150 },
  { type: 'x',     frame: 162 },
  { type: 'check', frame: 174 },
  { type: 'x',     frame: 186 },
  { type: 'x',     frame: 198 },
  // Row 4 — X dominant
  { type: 'x',     frame: 210 },
  { type: 'x',     frame: 222 },
  { type: 'x',     frame: 234 },
  { type: 'x',     frame: 246 },
  { type: 'none',  frame: Infinity },
  // Row 5 — stays empty (explosion triggers before it fills)
  { type: 'none',  frame: Infinity },
  { type: 'none',  frame: Infinity },
  { type: 'none',  frame: Infinity },
  { type: 'none',  frame: Infinity },
  { type: 'none',  frame: Infinity },
];

// Frame map (30fps, 15s = 450 frames)
const EXPLOSION_START = 265; // ~8.8s — grid starts to shatter
const EXPLOSION_END   = 360; // ~12s  — fragments clear, punchline begins
const TOTAL_FRAMES    = 450; // 15s

// 28 shatter fragments — fixed seeds so render is deterministic
const FRAGMENTS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x:  25 + rand(i * 5    ) * 50,        // % left (centered area)
  y:  28 + rand(i * 5 + 1) * 44,        // % top
  w:  70 + rand(i * 5 + 2) * 130,       // px width
  h:  50 + rand(i * 5 + 3) * 100,       // px height
  tx: (rand(i * 5 + 4) - 0.5) * 720,    // horizontal travel
  ty: (rand(i * 5 + 5) - 0.5) * 500 - 60, // vertical (slight upward bias)
  rz: (rand(i * 5 + 6) - 0.5) * 420,    // Z rotation
  rx: (rand(i * 5 + 7) - 0.5) * 130,    // X rotation (3D tilt)
  ry: (rand(i * 5 + 8) - 0.5) * 130,    // Y rotation (3D tilt)
  isBlue:  rand(i * 5 + 9)  > 0.75,     // some fragments pick up the blue accent
  opacity: 0.5 + rand(i * 5 + 10) * 0.5,
}));

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

const fadeIn = (frame, start, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

export const ConsistencyVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isExploding = frame >= EXPLOSION_START;

  // Headline — slides up on a spring
  const headSpring = spring({ frame, fps, config: { damping: 20, stiffness: 90 }, durationInFrames: 30 });
  const headY       = interpolate(headSpring, [0, 1], [50, 0]);
  const headOpacity = interpolate(headSpring, [0, 1], [0, 1]);

  // Main content fades out fast when explosion hits
  const contentOpacity = isExploding
    ? interpolate(frame, [EXPLOSION_START, EXPLOSION_START + 10], [1, 0], clamp)
    : 1;

  // Punchline slides up after explosion clears
  const punchAge     = Math.max(0, frame - (EXPLOSION_END - 10));
  const punchSpring  = spring({ frame: punchAge, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 40 });
  const punchOpacity = fadeIn(frame, EXPLOSION_END - 10, 35);
  const punchY       = interpolate(punchSpring, [0, 1], [70, 0]);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily }}>

      {/* ── MAIN CONTENT ── */}
      <AbsoluteFill style={{
        opacity: contentOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 56,
      }}>

        {/* Headline */}
        <div style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          textAlign: 'center',
          width: '78%',
        }}>
          <p style={{ fontSize: 64, fontWeight: 800, color: TEXT_COLOR, lineHeight: 1.2, margin: 0 }}>
            Consistency does not guarantee success.
          </p>
        </div>

        {/* 5×5 Grid */}
        <div style={{
          opacity: fadeIn(frame, 20, 15),
          display: 'grid',
          gridTemplateColumns: `repeat(5, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(5, ${CELL_SIZE}px)`,
          border: `2px solid ${BORDER_COLOR}`,
        }}>
          {GRID_CELLS.map((cell, i) => {
            const age = Math.max(0, frame - cell.frame);
            const sp  = cell.type === 'none' ? 0 : spring({
              frame: age,
              fps,
              config: { damping: 12, stiffness: 260 },
              durationInFrames: 10,
            });

            return (
              <div key={i} style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: CELL_BG,
                border: `1px solid ${BORDER_COLOR}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}>
                {cell.type !== 'none' && (
                  <span style={{
                    opacity: sp,
                    transform: `scale(${interpolate(sp, [0, 1], [0.2, 1])})`,
                    fontSize: 42,
                    lineHeight: 1,
                    color: cell.type === 'check' ? CHECK_COLOR : X_COLOR,
                    fontWeight: 800,
                    display: 'block',
                    userSelect: 'none',
                  }}>
                    {cell.type === 'check' ? '✓' : '✕'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Logo */}
        <div style={{ opacity: headOpacity, fontSize: 28, fontWeight: 800, color: '#444', letterSpacing: 3 }}>
          LM
        </div>
      </AbsoluteFill>

      {/* ── SHATTER FRAGMENTS ── */}
      {isExploding && (
        <AbsoluteFill style={{ perspective: '700px' }}>
          {FRAGMENTS.map((f) => {
            const age = Math.max(0, frame - EXPLOSION_START);
            const sp  = spring({
              frame: age,
              fps,
              config: { damping: 22, stiffness: 55 },
              durationInFrames: 70,
            });

            const fragOpacity = interpolate(
              frame,
              [EXPLOSION_START, EXPLOSION_START + 8, EXPLOSION_END - 30, EXPLOSION_END],
              [0, f.opacity, f.opacity * 0.5, 0],
              clamp
            );

            return (
              <div key={f.id} style={{
                position: 'absolute',
                left:   `${f.x}%`,
                top:    `${f.y}%`,
                width:  f.w,
                height: f.h,
                opacity: fragOpacity,
                background: f.isBlue ? 'rgba(90,180,216,0.22)' : 'rgba(36,36,36,0.95)',
                border: `1px solid ${BORDER_COLOR}`,
                transformStyle: 'preserve-3d',
                transform: [
                  `translate(${interpolate(sp, [0, 1], [0, f.tx])}px, ${interpolate(sp, [0, 1], [0, f.ty])}px)`,
                  `rotateZ(${interpolate(sp, [0, 1], [0, f.rz])}deg)`,
                  `rotateX(${interpolate(sp, [0, 1], [0, f.rx])}deg)`,
                  `rotateY(${interpolate(sp, [0, 1], [0, f.ry])}deg)`,
                ].join(' '),
              }} />
            );
          })}
        </AbsoluteFill>
      )}

      {/* ── PUNCHLINE ── */}
      <AbsoluteFill style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: punchOpacity,
        transform: `translateY(${punchY}px)`,
      }}>
        <p style={{
          fontSize: 64,
          fontWeight: 800,
          color: TEXT_COLOR,
          lineHeight: 1.2,
          margin: 0,
          textAlign: 'center',
          width: '78%',
        }}>
          But inconsistency does guarantee failure.
        </p>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
