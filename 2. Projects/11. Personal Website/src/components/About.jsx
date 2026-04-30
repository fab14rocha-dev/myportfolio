import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      }
    );
  }, []);

  return (
    <section id="about" className="about" ref={ref}>
      <h2 className="section-heading">About</h2>
      <p className="about-text">
        I spent years in language services, then decided to teach myself to code.
        Instead of following tutorials, I started building real things and using AI
        as my pair programmer. Six projects in a few months: two live products, a
        client build, and an ongoing challenge to help 100 businesses solve real
        problems for free.
      </p>
      <p className="about-text" style={{ marginTop: "1.25rem" }}>
        I work with vanilla JS, Firebase, React, and whatever else the project needs.
      </p>
    </section>
  );
}
