import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import LightningBolts from "./LightningBolts";
import "../styles/Hero.css";

export default function Hero() {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(headingRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(subRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4")
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
  }, []);

  return (
    <section className="hero">
      <div className="hero-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <LightningBolts />
      <div className="hero-content">
        <h1 ref={headingRef} className="hero-heading">
          Hi, I'm <span className="highlight">Fabrício</span>
        </h1>
        <p ref={subRef} className="hero-sub">
          I've been studying coding & AI and decided to showcase some of my projects here.
        </p>
        <a ref={ctaRef} href="#projects" className="hero-cta">
          See what I've built and launched so far
        </a>
      </div>
    </section>
  );
}