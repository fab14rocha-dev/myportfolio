import { useEffect, useRef } from "react";
import "../styles/BurnEffect.css";

const FIRE_COLORS = ["#ff2200", "#ff4400", "#ff6600", "#ff9900", "#ffcc00"];

function getFireLine(W, fireYBase, elapsed) {
  const points = [];
  const step = 5;
  for (let x = 0; x <= W + step; x += step) {
    const wave =
      Math.sin(x * 0.026 + elapsed * 0.003) * 24 +
      Math.sin(x * 0.061 + elapsed * 0.005) * 13 +
      Math.sin(x * 0.013 + elapsed * 0.002) * 32;
    points.push({ x, y: fireYBase + wave });
  }
  return points;
}

function updateClip(panelEl, points, H) {
  const W = panelEl.offsetWidth;
  const pts = [];
  pts.push("0% 0%");
  pts.push("100% 0%");
  pts.push(`100% ${Math.max(0, (points[points.length - 1].y / H) * 100).toFixed(1)}%`);
  for (let i = points.length - 1; i >= 0; i--) {
    const px = ((points[i].x / W) * 100).toFixed(1);
    const py = Math.max(0, ((points[i].y / H) * 100)).toFixed(1);
    pts.push(`${px}% ${py}%`);
  }
  pts.push(`0% ${Math.max(0, (points[0].y / H) * 100).toFixed(1)}%`);
  panelEl.style.clipPath = `polygon(${pts.join(", ")})`;
}

export default function BurnEffect({ panelRef, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const DURATION = 1000;
    const start = performance.now();
    const embers = [];
    let rafId;
    let done = false;

    class Ember {
      constructor(x, y) {
        this.x = x;
        this.y = y + (Math.random() - 0.5) * 6;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -(1 + Math.random() * 3);
        this.life = 0.7 + Math.random() * 0.3;
        this.decay = 0.013 + Math.random() * 0.02;
        this.size = 0.8 + Math.random() * 2.5;
        this.color = FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)];
      }
      update() {
        this.x += this.vx + (Math.random() - 0.5) * 0.5;
        this.y += this.vy;
        this.vy *= 0.985;
        this.life -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 7;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const render = (now) => {
      ctx.clearRect(0, 0, W, H);

      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const fireYBase = H * (1 - progress);
      const line = getFireLine(W, fireYBase, elapsed);

      // Update panel clip-path (no dark fill needed)
      if (panelRef?.current) updateClip(panelRef.current, line, H);

      // Draw fire gradient following the wavy line
      const fh = 55;
      ctx.beginPath();
      ctx.moveTo(line[0].x, line[0].y - fh);
      line.forEach((p) => ctx.lineTo(p.x, p.y - fh));
      [...line].reverse().forEach((p) => ctx.lineTo(p.x, p.y + 14));
      ctx.closePath();

      const avgY = fireYBase;
      const grad = ctx.createLinearGradient(0, avgY - fh, 0, avgY + 14);
      grad.addColorStop(0,    "rgba(255, 80,  0, 0)");
      grad.addColorStop(0.3,  "rgba(255, 110, 0, 0.5)");
      grad.addColorStop(0.65, "rgba(255, 55,  0, 0.88)");
      grad.addColorStop(0.85, "rgba(255, 200, 0, 1)");
      grad.addColorStop(1,    "rgba(40,  6,   0, 0.7)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Spawn embers along the fire line
      if (progress < 1 && Math.random() < 0.4) {
        const idx = Math.floor(Math.random() * line.length);
        embers.push(new Ember(line[idx].x, line[idx].y));
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        embers[i].update();
        if (embers[i].life <= 0) { embers.splice(i, 1); continue; }
        embers[i].draw();
      }

      if (!done && progress >= 1) {
        done = true;
        if (panelRef?.current) panelRef.current.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
        onComplete();
      } else if (!done) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);
    return () => {
      done = true;
      cancelAnimationFrame(rafId);
    };
  }, [onComplete, panelRef]);

  return <canvas ref={canvasRef} className="burn-canvas" />;
}