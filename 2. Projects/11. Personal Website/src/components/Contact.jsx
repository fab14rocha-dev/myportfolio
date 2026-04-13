import MagneticButton from "./MagneticButton";
import "../styles/Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="section-heading">Get in touch</h2>
      <p className="contact-text">
        I'd love to know if you have an idea for me to build.
      </p>
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
