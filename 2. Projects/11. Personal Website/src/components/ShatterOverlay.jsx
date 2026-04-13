import { motion } from "framer-motion";
import { useEffect } from "react";
import "../styles/ShatterOverlay.css";

const SHARDS = [
  { clip: "polygon(0% 0%, 52% 0%, 36% 46%, 0% 32%)",          dx: -480, dy: -300, rot: -55 },
  { clip: "polygon(52% 0%, 100% 0%, 100% 36%, 64% 50%)",       dx:  460, dy: -280, rot:  48 },
  { clip: "polygon(0% 32%, 36% 46%, 22% 100%, 0% 100%)",       dx: -400, dy:  340, rot: -65 },
  { clip: "polygon(64% 50%, 100% 36%, 100% 100%, 78% 100%)",   dx:  430, dy:  320, rot:  55 },
  { clip: "polygon(36% 46%, 64% 50%, 52% 100%, 22% 100%)",     dx:  -60, dy:  420, rot: -24 },
  { clip: "polygon(52% 100%, 64% 50%, 78% 100%)",              dx:  180, dy:  400, rot:  35 },
  { clip: "polygon(36% 0%, 64% 0%, 64% 50%, 36% 46%)",        dx:   30, dy: -400, rot:  12 },
];

export default function ShatterOverlay({ rect, onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 620);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="shatter-root">
      {/* Shards */}
      {SHARDS.map((s, i) => (
        <motion.div
          key={i}
          className="shard"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            clipPath: s.clip,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.dx, y: s.dy, rotate: s.rot, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.45, ease: [0.2, 0, 0.9, 1], delay: i * 0.015 }}
        />
      ))}

      {/* Screen flash */}
      <motion.div
        className="shatter-flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 0] }}
        transition={{ duration: 0.4, times: [0, 0.12, 0.35, 1], delay: 0.18 }}
      />
    </div>
  );
}