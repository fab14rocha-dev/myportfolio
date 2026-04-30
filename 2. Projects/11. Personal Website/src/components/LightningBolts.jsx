import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "../styles/LightningBolts.css";

function triggerFlash(el, large) {
  el.classList.remove("flash-active", "flash-large");
  void el.offsetWidth;
  el.classList.add("flash-active");
  if (large) el.classList.add("flash-large");
}

function buildBolt(x1, y1, x2, y2, roughness, depth) {
  let points = [[x1, y1], [x2, y2]];
  let r = roughness;
  for (let i = 0; i < depth; i++) {
    const next = [points[0]];
    for (let j = 0; j < points.length - 1; j++) {
      const [ax, ay] = points[j];
      const [bx, by] = points[j + 1];
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      const len = Math.hypot(bx - ax, by - ay);
      const angle = Math.atan2(by - ay, bx - ax) + Math.PI / 2;
      const offset = (Math.random() - 0.5) * r * len;
      next.push([mx + Math.cos(angle) * offset, my + Math.sin(angle) * offset], [bx, by]);
    }
    points = next;
    r *= 0.58;
  }
  return points;
}

function drawPath(ctx, points, alpha, width, glowColor, coreColor) {
  if (points.length < 2) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = alpha * 0.5;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = width * 5;
  ctx.shadowBlur = 18;
  ctx.shadowColor = glowColor;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = coreColor;
  ctx.lineWidth = width;
  ctx.shadowBlur = 6;
  ctx.shadowColor = "#fff";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();
  ctx.restore();
}

function createStrike(w, h) {
  const large = Math.random() < 0.35;
  const x1 = w * (0.05 + Math.random() * 0.9);
  const y1 = h * (Math.random() * 0.25);
  const x2 = x1 + (Math.random() - 0.5) * w * (large ? 0.45 : 0.22);
  const y2 = y1 + h * (0.25 + Math.random() * (large ? 0.6 : 0.35));
  const main = buildBolt(x1, y1, x2, y2, 0.45, large ? 7 : 5);
  const branchCount = large ? 3 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 2);
  const branches = [];
  for (let i = 0; i < branchCount; i++) {
    const idx = Math.floor(main.length * 0.15 + Math.random() * main.length * 0.65);
    const [bx, by] = main[idx];
    const baseAngle = Math.atan2(y2 - y1, x2 - x1);
    const angle = baseAngle + (Math.random() - 0.5) * 1.6;
    const len = h * (large ? 0.15 : 0.08) * (0.4 + Math.random());
    branches.push(buildBolt(bx, by, bx + Math.cos(angle) * len, by + Math.sin(angle) * len, 0.5, large ? 5 : 3));
  }
  const subBranches = [];
  if (large) {
    branches.forEach((bPts) => {
      if (Math.random() < 0.55 && bPts.length > 6) {
        const idx = Math.floor(bPts.length * 0.25 + Math.random() * bPts.length * 0.5);
        const [sbx, sby] = bPts[idx];
        const angle = Math.atan2(bPts.at(-1)[1] - bPts[0][1], bPts.at(-1)[0] - bPts[0][0]) + (Math.random() - 0.5) * 2;
        const len = h * 0.07 * Math.random();
        subBranches.push(buildBolt(sbx, sby, sbx + Math.cos(angle) * len, sby + Math.sin(angle) * len, 0.55, 3));
      }
    });
  }
  return { main, branches, subBranches, large, alpha: 1, fadeSpeed: 0.022 + Math.random() * 0.018 };
}

function createTargetedStrike(w, h, targetX, targetY) {
  const x1 = targetX + (Math.random() - 0.5) * w * 0.12;
  const y1 = 0;
  const x2 = targetX + (Math.random() - 0.5) * 12;
  const y2 = targetY;
  const main = buildBolt(x1, y1, x2, y2, 0.38, 6);
  const branches = [];
  for (let i = 0; i < 2; i++) {
    const idx = Math.floor(main.length * 0.4 + Math.random() * main.length * 0.35);
    const [bx, by] = main[idx];
    const angle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.8;
    const len = 30 + Math.random() * 50;
    branches.push(buildBolt(bx, by, bx + Math.cos(angle) * len, by + Math.sin(angle) * len, 0.5, 3));
  }
  return { main, branches, subBranches: [], large: true, alpha: 1, fadeSpeed: 0.06 };
}

const LightningBolts = forwardRef(function LightningBolts(props, ref) {
  const canvasRef  = useRef(null);
  const flashRef   = useRef(null);
  const strikesRef = useRef([]);
  const sparksRef  = useRef([]);

  useImperativeHandle(ref, () => ({
    fireAt(viewportX, viewportY) {
      const canvas = canvasRef.current;
      const cr = canvas.getBoundingClientRect();
      const x = viewportX - cr.left;
      const y = viewportY - cr.top;
      strikesRef.current.push(createTargetedStrike(canvas.offsetWidth, canvas.offsetHeight, x, y));
      triggerFlash(flashRef.current, true);
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i / 10) + (Math.random() - 0.5) * 0.6;
        const speed = 3 + Math.random() * 5;
        sparksRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          alpha: 1,
          size: 1.5 + Math.random() * 2,
        });
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const flash  = flashRef.current;
    const ctx    = canvas.getContext("2d");
    let rafId;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (const s of strikesRef.current) {
        const glow = "rgba(0,196,106,1)";
        const core = "#c8fff0";
        drawPath(ctx, s.main,        s.alpha,        s.large ? 1.4 : 0.9, glow, core);
        s.branches.forEach((b)   => drawPath(ctx, b,  s.alpha * 0.75, s.large ? 0.8 : 0.55, glow, core));
        s.subBranches.forEach((sb) => drawPath(ctx, sb, s.alpha * 0.5, 0.4, glow, core));
        s.alpha -= s.fadeSpeed;
      }
      strikesRef.current = strikesRef.current.filter(s => s.alpha > 0);

      for (const sp of sparksRef.current) {
        ctx.save();
        ctx.globalAlpha = sp.alpha * 0.9;
        ctx.fillStyle = sp.alpha > 0.6 ? "#ffffff" : "rgba(0,196,106,1)";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0,196,106,0.8)";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        sp.x  += sp.vx;
        sp.y  += sp.vy;
        sp.vy += 0.2;
        sp.vx *= 0.95;
        sp.alpha -= 0.055;
      }
      sparksRef.current = sparksRef.current.filter(sp => sp.alpha > 0);

      rafId = requestAnimationFrame(render);
    };
    render();

    const schedule = () => {
      const delay = 350 + Math.random() * 2200;
      setTimeout(() => {
        if (!document.hidden) {
          const w = canvas.offsetWidth;
          const h = canvas.offsetHeight;
          const s = createStrike(w, h);
          strikesRef.current.push(s);
          if (Math.random() < 0.2) triggerFlash(flash, s.large);
          if (Math.random() < 0.3) {
            setTimeout(() => {
              if (!document.hidden) {
                const s2 = createStrike(w, h);
                strikesRef.current.push(s2);
                if (Math.random() < 0.15) triggerFlash(flash, s2.large);
              }
            }, 90 + Math.random() * 120);
          }
        }
        schedule();
      }, delay);
    };
    schedule();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="lightning-canvas" />
      <div ref={flashRef} className="storm-flash" />
    </>
  );
});

export default LightningBolts;
