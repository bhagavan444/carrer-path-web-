import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <main className="contact-main">
      <section className="contact-card">
        <h1 className="contact-title">
          <span className="contact-emoji">📬</span> Get in Touch
        </h1>

        <p className="contact-intro">
          Thank you for your interest in my work. I am open to opportunities in{" "}
          <strong>AI Engineering, Software Development, and Data Science</strong>.  
          Whether you have a collaboration idea, a project requirement, or a professional query,  
          <span className="contact-highlight">I would be glad to connect and discuss.</span>
        </p>

        <div className="contact-divider"></div>

        <h2 className="contact-subtitle">📞 Direct Contact</h2>
        <div className="contact-methods">
          <a className="contact-method" href="tel:+917569205626">
            <span className="contact-icon">📞</span>
            <span className="contact-details">+91 7569205626</span>
          </a>

          <a
            className="contact-method"
            href="mailto:g.sivasatyasaibhagavan@gmail.com"
          >
            <span className="contact-icon">✉️</span>
            <span className="contact-details">g.sivasatyasaibhagavan@gmail.com</span>
          </a>
        </div>

        <div className="contact-divider"></div>

        <h2 className="contact-subtitle">🌐 Professional Profiles</h2>
        <p className="contact-note">
          Explore my work, projects, and professional journey through the links below.
        </p>

        <div className="contact-socials">
          <a
            href="https://github.com/bhagavan444"
            className="contact-social-btn github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
            />
            <span className="contact-social-text">GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/bhagavan444"
            className="contact-social-btn linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
            />
            <span className="contact-social-text">LinkedIn</span>
          </a>
        </div>

        <div className="contact-divider"></div>

        <section className="contact-extra">
          <h2 className="contact-subtitle">💡 Why Connect With Me?</h2>
          <ul className="contact-features">
            <li>✔️ Passionate about building real-world AI & ML applications</li>
            <li>✔️ Strong foundation in MERN stack, Python, Flask & Deep Learning</li>
            <li>✔️ Experience developing end-to-end intelligent systems</li>
            <li>✔️ Belief in clean code, scalable systems, and continuous learning</li>
          </ul>

          <blockquote className="contact-quote">
            “I strive to build technology that solves real problems and makes everyday life easier.  
            Let’s collaborate and create meaningful impact together.”
          </blockquote>
        </section>
      </section>
    </main>
  );
}

export default Contact;
