import { motion } from "framer-motion";
import "../styles/FireParticle.css";

export default function FireParticle({ origin, onComplete }) {
  const startX = origin?.x ?? window.innerWidth / 2;
  const startY = origin?.y ?? window.innerHeight / 2;

  return (
    <motion.div
      className="fire-particle"
      style={{ left: startX, top: startY, transform: "translate(-50%, -50%)" }}
      initial={{ y: 0, scale: 1, opacity: 1 }}
      animate={{ y: -startY - 60, scale: 0.1, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.3, 0, 0.7, 1] }}
      onAnimationComplete={onComplete}
    >
      <div className="fire-particle-core" />
    </motion.div>
  );
}