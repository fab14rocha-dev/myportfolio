import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toolDescriptions } from "../data/tools";
import "../styles/ToolChip.css";

export default function ToolChip({ name }) {
  const [hovered, setHovered] = useState(false);
  const description = toolDescriptions[name];

  return (
    <span
      className="tool-chip"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {name}
      <AnimatePresence>
        {hovered && description && (
          <motion.span
            className="tool-tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {description}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}