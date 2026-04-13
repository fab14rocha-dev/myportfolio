import { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import "../styles/ProjectCard.css";

export default function ProjectCard({ project, onSelect, hidden }) {
  const ref = useRef(null);
  const flashRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const onMouseEnter = () => {
    const el = flashRef.current;
    el.classList.remove("card-flash-active");
    void el.offsetWidth;
    el.classList.add("card-flash-active");
  };

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 14);
    rotateX.set(-y * 14);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="project-card"
      onClick={() => onSelect(project, ref.current.getBoundingClientRect())}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, opacity: hidden ? 0 : 1 }}
      whileHover={{ y: -6, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div ref={flashRef} className="card-flash" />
      <div className="card-inner">
        <div className="card-status">{project.status}</div>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-tagline">{project.tagline}</p>
        <div className="card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}