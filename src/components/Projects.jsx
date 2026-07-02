import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import ShatterOverlay from "./ShatterOverlay";
import FactSheet from "./FactSheet";
import "../styles/Projects.css";

gsap.registerPlugin(ScrollTrigger);

// phase: 'idle' | 'shattering' | 'open'

export default function Projects() {
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [selected, setSelected] = useState(null);
  const [cardRect, setCardRect] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: headingRef.current, start: "top 85%" } }
    );
    gsap.fromTo(
      gridRef.current.children,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase !== "idle" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  const handleSelect = (project, rect) => {
    setSelected(project);
    setCardRect(rect);
    setPhase("shattering");
  };

  const handleClose = () => {
    setPhase("idle");
    setSelected(null);
    setCardRect(null);
  };

  return (
    <>
      <section id="projects" className="projects">
        <h2 ref={headingRef} className="section-heading">Projects</h2>
        <div ref={gridRef} className="projects-grid">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onSelect={handleSelect}
              hidden={selected?.id === p.id && phase !== "idle"}
            />
          ))}
        </div>
        <a href="#contact" className="scroll-hint scroll-hint--inline" aria-label="Scroll to contact">
          <span className="scroll-hint-arrow" />
        </a>
      </section>

      {phase === "shattering" && cardRect && (
        <ShatterOverlay rect={cardRect} onComplete={() => setPhase("open")} />
      )}

      {phase === "open" && (
        <FactSheet project={selected} onClose={handleClose} />
      )}
    </>
  );
}