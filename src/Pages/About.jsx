import React from "react";
import "./About.css";

function About() {
  return (
    <main className="abt-main">

      {/* ========================= HERO ========================= */}
      <section className="abt-hero">
        <div className="abt-hero-inner">

          <div className="abt-avatar-card">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Developer profile"
              className="abt-avatar"
            />
          </div>

          <div className="abt-intro">
            <h1 className="abt-name">Career Path AI Platform</h1>

            <p className="abt-title">
              <span className="gradient-text">
                AI-Driven Career Guidance • Resume Analysis • Skill Mapping
              </span>
            </p>

            <div className="abt-location">
              <span><strong>Developed by:</strong> G S S S Bhagavan</span><br />
              <span><strong>Degree:</strong> B.Tech – Artificial Intelligence & Data Science</span><br />
              <span><strong>College:</strong> Ramachandra College of Engineering, Eluru</span>
            </div>

            <blockquote className="abt-quote">
              “Built with a focus on practical career problems — reducing ambiguity,
              improving resume quality, and helping users make informed career decisions.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* ========================= CONTEXT ========================= */}
      <section className="abt-card">
        <h2 className="abt-section-title">Why This Platform Exists</h2>
        <p className="abt-description">
          Many students and early-career professionals struggle with unclear career paths,
          poorly optimized resumes, and lack of structured guidance. This platform was built
          to address those gaps using a combination of AI-based analysis and guided workflows.
        </p>

        <p className="abt-description">
          The goal is not to replace human decision-making, but to support it — by providing
          faster insights, structured recommendations, and consistent feedback.
        </p>
      </section>

      {/* ========================= WHAT IT DOES ========================= */}
      <section className="abt-card">
        <h2 className="abt-section-title">What the System Does</h2>

        <ul className="abt-values">
          <li>
            <span className="abt-value-icon">📄</span>
            <strong>Resume Analysis:</strong> Parses resumes, extracts skills, and evaluates alignment
            with common job role requirements.
          </li>

          <li>
            <span className="abt-value-icon">🤖</span>
            <strong>CareerBot:</strong> Provides contextual guidance, interview preparation tips,
            and general career-related Q&A.
          </li>

          <li>
            <span className="abt-value-icon">📊</span>
            <strong>Skill Gap Identification:</strong> Highlights missing or weak skills
            relative to a selected role.
          </li>

          <li>
            <span className="abt-value-icon">🧭</span>
            <strong>Career Roadmaps:</strong> Suggests structured next steps such as skills to learn,
            certifications, or preparation focus areas.
          </li>
        </ul>
      </section>

      {/* ========================= REALISTIC USE CASES ========================= */}
      <section className="abt-card">
        <h2 className="abt-section-title">Intended Use Cases</h2>

        <div className="usecase-grid">
          <div className="usecase">
            <h3>Students & Fresh Graduates</h3>
            <p>
              To understand role expectations, improve resumes, and plan skill development
              before applying for jobs.
            </p>
          </div>

          <div className="usecase">
            <h3>Placement Cells</h3>
            <p>
              As a supporting tool for resume reviews, mock interviews,
              and structured career guidance.
            </p>
          </div>

          <div className="usecase">
            <h3>Early-Career Professionals</h3>
            <p>
              To reassess career direction, identify gaps, and plan transitions
              into new technical roles.
            </p>
          </div>

          <div className="usecase">
            <h3>Prototype for HR Tools</h3>
            <p>
              Can serve as a base for internal screening or career-support systems
              with further customization.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= TECH STACK ========================= */}
      <section className="abt-card">
        <h2 className="abt-section-title">Technical Overview</h2>

        <div className="tech-grid">
          <div className="tech">
            <strong>Frontend</strong>
            <div>React, CSS (Enterprise-style UI), Framer Motion</div>
          </div>

          <div className="tech">
            <strong>Backend</strong>
            <div>Flask / REST APIs</div>
          </div>

          <div className="tech">
            <strong>AI / ML</strong>
            <div>NLP-based parsing, role matching logic</div>
          </div>

          <div className="tech">
            <strong>Data</strong>
            <div>Structured skill datasets, resume text processing</div>
          </div>
        </div>

        <p className="abt-description" style={{ marginTop: 16 }}>
          The system is designed in a modular way so individual components
          (resume parsing, chatbot, recommendations) can be extended independently.
        </p>
      </section>

      {/* ========================= ROADMAP ========================= */}
      <section className="abt-card">
        <h2 className="abt-section-title">Planned Improvements</h2>
        <ol className="roadmap-list">
          <li>Improve resume parsing accuracy and formatting support</li>
          <li>Add role-specific interview simulations</li>
          <li>Introduce basic analytics for career progress tracking</li>
          <li>Enhance security and data handling for production readiness</li>
        </ol>
      </section>

      {/* ========================= DEVELOPER ========================= */}
      <section className="abt-card abt-personal-card">
        <h2 className="abt-section-title">About the Developer</h2>

        <p className="abt-description">
          <strong>G S S S Bhagavan</strong> is a B.Tech student specializing in Artificial Intelligence
          & Data Science. This project reflects a focus on applying AI concepts to
          real-world career and hiring challenges.
        </p>

        <div className="abt-profile highlight-box">
          <div><strong>Focus Areas:</strong> AI, Data Science, Web Applications</div>
          <div><strong>College:</strong> Ramachandra College of Engineering</div>
          <div><strong>Location:</strong> Eluru, Andhra Pradesh</div>
          <div style={{ marginTop: 10 }}>
            <strong>Email:</strong> gsiva@example.com
          </div>
        </div>
      </section>

    </main>
  );
}

export default About;
