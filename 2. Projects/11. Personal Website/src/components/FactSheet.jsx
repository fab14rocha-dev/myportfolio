import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolChip from "./ToolChip";
import BurnEffect from "./BurnEffect";
import FireParticle from "./FireParticle";
import "../styles/FactSheet.css";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

const panel = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.3 } },
};

const item = (i) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.07, duration: 0.4, ease: "easeOut" } },
});

export default function FactSheet({ project, onClose }) {
  const [burning, setBurning] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchOrigin, setLaunchOrigin] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const { facts } = project;

  const handleVisit = (e) => {
    e.preventDefault();
    if (window.matchMedia("(hover: none)").matches) {
      window.open(project.link, "_blank", "noopener,noreferrer");
      onClose();
    } else {
      setBurning(true);
    }
  };

  const handleBurnComplete = useCallback(() => {
    setBurning(false);
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top });
    }
    setLaunching(true);
  }, []);

  const handleLaunchComplete = useCallback(() => {
    window.open(project.link, "_blank", "noopener,noreferrer");
    onClose();
  }, [project.link, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fs-backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={!burning ? onClose : undefined}
      />

      {launching && <FireParticle origin={launchOrigin} onComplete={handleLaunchComplete} />}

      <div className="fs-portal">
        <motion.div
          ref={panelRef}
          className="fs-panel"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fs-scanlines" />

          {burning && <BurnEffect panelRef={panelRef} onComplete={handleBurnComplete} />}

          <motion.button className="fs-close" onClick={onClose} variants={item(0)} initial="hidden" animate="visible">
            ✕
          </motion.button>

          <motion.div className="fs-header" variants={item(0)} initial="hidden" animate="visible">
            <span className="fs-status">{project.status}</span>
            <h2 className="fs-title">{project.title}</h2>
            <div className="fs-qa">
              <div className="fs-qa-block">
                <p className="fs-qa-q">What is it?</p>
                <p className="fs-qa-a">{facts.whatIsIt}</p>
              </div>
              <div className="fs-qa-block">
                <p className="fs-qa-q">Why did I build it?</p>
                <p className="fs-qa-a">{facts.whyBuilt}</p>
              </div>
            </div>
          </motion.div>

          <div className="fs-stats">
            {[
              { label: "Time spent",      value: facts.timeSpent },
              { label: "Damage (so far)", value: facts.cost      },
              { label: "Started",         value: facts.started   },
            ].map((stat, i) => (
              <motion.div key={stat.label} className="fs-stat" variants={item(i + 1)} initial="hidden" animate="visible">
                <span className="fs-stat-label">{stat.label}</span>
                <span className="fs-stat-value">{stat.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div className="fs-section" variants={item(4)} initial="hidden" animate="visible">
            <p className="fs-section-label">🛠 Free tools used</p>
            <div className="fs-tools">
              {facts.tools.map((t) => (
                <ToolChip key={t} name={t} />
              ))}
            </div>
          </motion.div>

          <motion.div className="fs-section fs-fun" variants={item(5)} initial="hidden" animate="visible">
            <p className="fs-section-label">⚡ Fun fact</p>
            <p className="fs-fun-text">"{facts.funFact}"</p>
          </motion.div>

          {project.link && project.link !== "#" && (
            <motion.div variants={item(6)} initial="hidden" animate="visible">
              <a
                href={project.link}
                className="fs-link"
                onClick={handleVisit}
              >
                Visit project →
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}