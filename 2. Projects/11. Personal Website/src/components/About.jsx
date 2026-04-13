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
        I'm a builder coming from a language services background, learning to code
        and shipping real projects along the way. I work with vanilla JS, Firebase,
        and now React.
      </p>
    </section>
  );
}
