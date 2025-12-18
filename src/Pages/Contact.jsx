import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <main className="contact-main">
      <section className="contact-card">

        {/* ================= HEADER ================= */}
        <header className="contact-header">
          <h1 className="contact-title">Contact</h1>
          <p className="contact-subtitle">
            Open to opportunities, collaborations, and professional discussions.
          </p>
        </header>

        {/* ================= INTRO ================= */}
        <p className="contact-intro">
          I am a developer with a strong focus on{" "}
          <strong>Artificial Intelligence, Full-Stack Development, and Data Science</strong>.
          I am currently open to entry-level roles, internships, project collaborations,
          and technical discussions. If you are a recruiter, hiring manager, or
          fellow engineer, I would be happy to connect.
        </p>

        <div className="contact-divider" />

        {/* ================= DIRECT CONTACT ================= */}
        <section>
          <h2 className="contact-section-title">Direct Contact</h2>

          <div className="contact-methods">
            <a className="contact-method" href="tel:+917569205626">
              <span className="contact-label">Phone</span>
              <span className="contact-value">+91 75692 05626</span>
            </a>

            <a
              className="contact-method"
              href="mailto:g.sivasatyasaibhagavan@gmail.com"
            >
              <span className="contact-label">Email</span>
              <span className="contact-value">
                g.sivasatyasaibhagavan@gmail.com
              </span>
            </a>
          </div>
        </section>

        <div className="contact-divider" />

        {/* ================= PROFILES ================= */}
        <section>
          <h2 className="contact-section-title">Professional Profiles</h2>
          <p className="contact-note">
            Access my code, projects, and professional background.
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
              <span>GitHub</span>
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
              <span>LinkedIn</span>
            </a>
          </div>
        </section>

        <div className="contact-divider" />

        {/* ================= VALUE ================= */}
        <section className="contact-extra">
          <h2 className="contact-section-title">Professional Strengths</h2>

          <ul className="contact-features">
            <li>Strong foundation in AI, Machine Learning, and Data Science concepts</li>
            <li>Hands-on experience with MERN Stack, Python, Flask, and Deep Learning</li>
            <li>Experience building end-to-end, production-style applications</li>
            <li>Focus on clean code, maintainability, and scalable design</li>
            <li>Adaptable learner with a problem-solving mindset</li>
          </ul>

          <blockquote className="contact-quote">
            “I focus on building practical, reliable software that delivers
            real value and can scale with evolving requirements.”
          </blockquote>
        </section>

        {/* ================= CTA ================= */}
        <footer className="contact-footer">
          <a
            className="contact-cta primary"
            href="mailto:g.sivasatyasaibhagavan@gmail.com?subject=Professional%20Opportunity"
          >
            Send Email
          </a>

          <a className="contact-cta secondary" href="/about">
            View Profile
          </a>
        </footer>

      </section>
    </main>
  );
}

export default Contact;
