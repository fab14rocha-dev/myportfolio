import MagneticButton from "./MagneticButton";
import "../styles/Contact.css";

const PROJECT_100_URL = "https://project100.dev/#open-form";

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="section-heading">I'm looking for more problems to solve.</h2>
      <p className="contact-text">
        Got a real problem that's worth solving? I'd love to hear about it.
      </p>
      <MagneticButton
        href={PROJECT_100_URL}
        className="contact-link contact-link--primary"
      >
        Tell me about your problem →
      </MagneticButton>
      <div className="contact-links">
        <MagneticButton
          href="https://www.instagram.com/fabriciorochaluz"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >
          Instagram
        </MagneticButton>
        <MagneticButton
          href="https://www.linkedin.com/in/fabriciodarocha/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >
          LinkedIn
        </MagneticButton>
      </div>
    </section>
  );
}
