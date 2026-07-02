import { useScroll, useSpring, motion } from "framer-motion";
import "../styles/ScrollProgress.css";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50 });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}
