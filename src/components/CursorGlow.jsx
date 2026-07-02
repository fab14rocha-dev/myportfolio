import { useEffect, useRef } from "react";
import "../styles/CursorGlow.css";

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    let mouseX = -400, mouseY = -400;
    let currentX = -400, currentY = -400;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, mouseX, 0.07);
      currentY = lerp(currentY, mouseY, 0.07);
      if (ref.current) {
        ref.current.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" />;
}
