import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projects } from "../data/projects";
import LightningBolts from "./LightningBolts";
import "../styles/Hero.css";

const WORDS = ["useful", "real", "fun", "free", "challenging"];

const completed  = projects.filter(p => p.status === "Complete").length;
const inProgress = projects.filter(p => p.status === "In Progress").length;
const toGo       = 100 - completed - inProgress;

export default function Hero() {
  const headingRef = useRef(null);
  const subRef     = useRef(null);
  const statsRef   = useRef(null);
  const ctaRef     = useRef(null);
  const wordRef    = useRef(null);
  const boltsRef   = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [flipState, setFlipState] = useState("visible");

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(headingRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(subRef.current,     { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4")
      .fromTo(statsRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
      .fromTo(ctaRef.current,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
  }, []);

  useEffect(() => {
    const cycle = setInterval(() => {
      // Fire bolt, flash the word on impact, then flip
      if (boltsRef.current && wordRef.current) {
        const rect = wordRef.current.getBoundingClientRect();
        boltsRef.current.fireAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
        wordRef.current.classList.add("flip-word--hit");
        setTimeout(() => wordRef.current?.classList.remove("flip-word--hit"), 250);
      }

      if (subRef.current) {
        subRef.current.classList.add("hero-sub--hit");
        setTimeout(() => subRef.current?.classList.remove("hero-sub--hit"), 300);
      }

      setTimeout(() => {
        setFlipState("out");
        setTimeout(() => {
          setWordIndex(i => (i + 1) % WORDS.length);
          setFlipState("in");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setFlipState("visible");
              if (wordRef.current) {
                wordRef.current.classList.add("flip-word--arriving");
                setTimeout(() => wordRef.current?.classList.remove("flip-word--arriving"), 600);
              }
            });
          });
        }, 300);
      }, 80);
    }, 2500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <section className="hero">
      <div className="hero-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <LightningBolts ref={boltsRef} />
      <div className="hero-content">
        <h1 ref={headingRef} className="hero-heading">
          Hi, I'm <span className="highlight">Fabrício</span>
        </h1>
        <p ref={subRef} className="hero-sub">
          I set myself a challenge: build something <span ref={wordRef} className={`flip-word flip-word--${flipState}`}>{WORDS[wordIndex]}</span> for 100 people.
        </p>
        <div ref={statsRef} className="hero-stats">
          <span><strong>{completed}</strong> completed</span>
          <span className="hero-stats-dot">·</span>
          <span><strong>{inProgress}</strong> in progress</span>
          <span className="hero-stats-dot">·</span>
          <span><strong>{toGo}</strong> to go</span>
        </div>
        <div ref={ctaRef} className="hero-ctas">
          <a href="#projects" className="hero-cta">
            See all projects
          </a>
        </div>
      </div>
      <a href="#projects" className="scroll-hint" aria-label="Scroll to projects">
        <span className="scroll-hint-arrow" />
      </a>
    </section>
  );
}
