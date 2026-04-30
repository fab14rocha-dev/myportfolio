import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', { weights: ['300', '700'] });

const COLORS = {
  bg: '#0a0a0a',
  text: '#F0F0F0',
  accent: '#4F85F6',
  muted: '#888',
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

const sceneOpacity = (frame, inStart, inEnd, outStart, outEnd) =>
  interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], clamp);

const fadeIn = (frame, start, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

// Frame map (30fps):
// Scene 1 — Hook:       0–150   (0–5s)
// Scene 2 — Three lines: 150–390 (5–13s)
// Scene 3 — Stats:      390–510 (13–17s)
// Scene 4 — CTA:        510–600 (17–20s)

export const Project100Ad = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene opacities — crossfade 15 frames between scenes
  const s1 = sceneOpacity(frame, 0, 10, 135, 150);
  const s2 = sceneOpacity(frame, 135, 150, 375, 390);
  const s3 = sceneOpacity(frame, 375, 390, 495, 510);
  const s4 = fadeIn(frame, 495, 20);

  // Scene 1 — slide-up spring for headline
  const headlineSpring = spring({ frame, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 40 });
  const headlineY = interpolate(headlineSpring, [0, 1], [80, 0]);
  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);
  const subtitleOpacity = fadeIn(frame, 30);

  // Scene 2 — lines fade in 2.5s (75 frames) apart
  const l1 = fadeIn(frame, 155);
  const l2 = fadeIn(frame, 230);
  const l3 = fadeIn(frame, 305);

  // Scene 3 — stats
  const statsOpacity = fadeIn(frame, 395);

  // Scene 4 — CTA
  const ctaOpacity = fadeIn(frame, 515);
  const ctaSubOpacity = fadeIn(frame, 535);

  const center = { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' };

  return (
    <AbsoluteFill style={{ background: COLORS.bg, fontFamily }}>

      {/* Scene 1: Hook */}
      <AbsoluteFill style={{ ...center, opacity: s1 }}>
        <div style={{ width: '82%' }}>
          <div style={{ transform: `translateY(${headlineY}px)`, opacity: headlineOpacity, marginBottom: 36 }}>
            <p style={{ fontSize: 54, fontWeight: 700, color: COLORS.text, lineHeight: 1.2, margin: 0 }}>
              I want to help 100 business owners solve real problems.
            </p>
          </div>
          <div style={{ opacity: subtitleOpacity }}>
            <p style={{ fontSize: 32, fontWeight: 300, color: COLORS.text, margin: 0 }}>
              I'll build the solution{' '}
              <span style={{ color: COLORS.accent }}>for free.</span>
            </p>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 2: Three lines */}
      <AbsoluteFill style={{ ...center, opacity: s2 }}>
        <div style={{ width: '82%' }}>
          <div style={{ opacity: l1, marginBottom: 48 }}>
            <p style={{ fontSize: 38, fontWeight: 300, color: COLORS.muted, margin: 0 }}>Tell me your problem.</p>
          </div>
          <div style={{ opacity: l2, marginBottom: 48 }}>
            <p style={{ fontSize: 38, fontWeight: 300, color: COLORS.muted, margin: 0 }}>We talk through it.</p>
          </div>
          <div style={{ opacity: l3 }}>
            <p style={{ fontSize: 38, fontWeight: 300, color: COLORS.muted, margin: 0 }}>I build the solution.</p>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 3: Stats */}
      <AbsoluteFill style={{ ...center, opacity: s3 }}>
        <div style={{ width: '82%', opacity: statsOpacity }}>
          <p style={{ fontSize: 120, fontWeight: 700, color: COLORS.accent, margin: 0, lineHeight: 1 }}>94</p>
          <p style={{ fontSize: 40, fontWeight: 300, color: COLORS.text, margin: '20px 0 0' }}>spots left.</p>
        </div>
      </AbsoluteFill>

      {/* Scene 4: CTA */}
      <AbsoluteFill style={{ ...center }}>
        <div style={{ width: '82%' }}>
          <div style={{ opacity: ctaOpacity }}>
            <p style={{ fontSize: 50, fontWeight: 700, color: COLORS.text, margin: '0 0 24px', lineHeight: 1.2 }}>
              Want to be one of the 100?
            </p>
          </div>
          <div style={{ opacity: ctaSubOpacity }}>
            <p style={{ fontSize: 32, fontWeight: 300, color: COLORS.accent, margin: 0 }}>Link in bio.</p>
          </div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
