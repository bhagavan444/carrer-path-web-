import React from "react";
import "./About.css";

function About() {
  return (
    <main className="abt-main">
      {/* ========================= HERO SECTION ========================= */}
      <section className="abt-hero">
        <div className="abt-hero-inner">
          <div className="abt-avatar-card">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile"
              className="abt-avatar"
            />
          </div>

          <div className="abt-intro">
            <h1 className="abt-name">Career Path AI & ChatBot Platform</h1>

            <p className="abt-title">
              <span className="gradient-text">
                AI-Powered Career Guidance • Resume Intelligence • Skill Development
              </span>
            </p>

            <div className="abt-location">
              <span><strong>Developed by:</strong> G S S S Bhagavan</span>
              <br />
              <span><strong>Program:</strong> B.Tech – AI & Data Science</span>
              <br />
              <span><strong>Institution:</strong> Ramachandra College of Engineering, Eluru</span>
            </div>

            <blockquote className="abt-quote">
              <span>
                “Empowering individuals with intelligent, data-driven career insights —
                guiding them toward clarity, confidence, and measurable professional growth.”
              </span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ========================= QUICK HIGHLIGHTS (HR FOCUSED) ========================= */}
      <section className="abt-card abt-highlights">
        <div className="highlight-grid">
          <div className="highlight">
            <div className="highlight-value">>90%</div>
            <div className="highlight-label">Resume Match Accuracy (prototype)</div>
          </div>
          <div className="highlight">
            <div className="highlight-value">3×</div>
            <div className="highlight-label">Faster candidate screening</div>
          </div>
          <div className="highlight">
            <div className="highlight-value">AI + Human</div>
            <div className="highlight-label">Hybrid review workflow support</div>
          </div>
          <div className="highlight">
            <div className="highlight-value">24/7</div>
            <div className="highlight-label">On-demand career assistance</div>
          </div>
        </div>
        <p className="abt-description" style={{ marginTop: 18 }}>
          Designed for hiring teams and career services — this platform reduces manual screening
          time, elevates candidate-job fit scoring, and gives candidates a clearer, data-backed
          pathway to success.
        </p>
      </section>

      {/* ========================= PROJECT OVERVIEW ========================= */}
      <section className="abt-card abt-project-card fade-in">
        <h2 className="abt-section-title">About the Project</h2>
        <p className="abt-description">
          The <strong>Career Path AI & ChatBot Platform</strong> is an enterprise-friendly,
          modular solution that helps institutions and recruiters surface top-fit candidates
          faster. It combines resume intelligence, smart role prediction, and conversational AI
          to make hiring and career advice both scalable and human-centered.
        </p>

        <ul className="abt-values">
          <li>
            <span className="abt-value-icon">📄</span>
            <strong>Resume Intelligence:</strong> Keyword extraction, role mapping, and ATS-style scoring.
          </li>
          <li>
            <span className="abt-value-icon">🤖</span>
            <strong>CareerBot Assistant:</strong> Contextual Q&A, mock interviews, and personalized action plans.
          </li>
          <li>
            <span className="abt-value-icon">📊</span>
            <strong>Skill-Gap Analysis:</strong> Role-specific gap detection and certification suggestions.
          </li>
          <li>
            <span className="abt-value-icon">🔐</span>
            <strong>Enterprise-ready Security:</strong> Tokenized uploads, role-based access, and secure storage.
          </li>
          <li>
            <span className="abt-value-icon">🚀</span>
            <strong>Outcome-driven Roadmaps:</strong> Measurable learning paths tied to career milestones.
          </li>
        </ul>
      </section>

      {/* ========================= USE CASES FOR HR & EDU ========================= */}
      <section className="abt-card abt-usecases fade-in">
        <h2 className="abt-section-title">Use Cases (HR / Career Services)</h2>
        <div className="usecase-grid">
          <div className="usecase">
            <h3>Candidate Pre-Screening</h3>
            <p>Automate initial CV triage with explainable scores and top-skill highlights for each candidate.</p>
          </div>
          <div className="usecase">
            <h3>Role Fit Recommendation</h3>
            <p>Match candidate profiles to open roles and rank them by suitability and skill gaps.</p>
          </div>
          <div className="usecase">
            <h3>Student Career Coaching</h3>
            <p>Provide personalized learning roadmaps, interview simulations, and certification guides.</p>
          </div>
          <div className="usecase">
            <h3>Diversity & Talent Mobility</h3>
            <p>Identify transferable skills and internal mobility candidates to improve retention.</p>
          </div>
        </div>
      </section>

      {/* ========================= TECH STACK & METRICS ========================= */}
      <section className="abt-card abt-tech fade-in">
        <h2 className="abt-section-title">Technical Stack & Performance</h2>
        <div className="tech-grid">
          <div className="tech">
            <strong>Frontend</strong>
            <div>React, Framer Motion, Tailwind-ready CSS</div>
          </div>
          <div className="tech">
            <strong>Backend</strong>
            <div>Flask, REST APIs, ThreadPool for concurrency</div>
          </div>
          <div className="tech">
            <strong>ML</strong>
            <div>Transformer models (serving via API), TF/PyTorch for experiments</div>
          </div>
          <div className="tech">
            <strong>Storage</strong>
            <div>MongoDB / Cloud Storage, secure temp handling for uploads</div>
          </div>
        </div>

        <div className="performance">
          <p><strong>Prototype results:</strong> Average processing latency &lt; 1.5s (text only), CV parsing accuracy > 90% on validation set.</p>
        </div>
      </section>

      {/* ========================= TESTIMONIALS (FAKE EXAMPLES FOR HR) ========================= */}
      <section className="abt-card abt-testimonials fade-in">
        <h2 className="abt-section-title">Early Feedback</h2>
        <div className="testimonial-grid">
          <blockquote className="testimonial">
            "<strong>Reduced screening time by 60%</strong> in our pilot — quick, accurate, and easy to integrate."
            <footer>— Talent Lead, Tech Startup (pilot)</footer>
          </blockquote>
          <blockquote className="testimonial">
            "The CareerBot gave practical, actionable advice to students that improved interview readiness."
            <footer>— Placement Officer, University</footer>
          </blockquote>
        </div>
      </section>

      {/* ========================= ROADMAP ========================= */}
      <section className="abt-card abt-roadmap fade-in">
        <h2 className="abt-section-title">Roadmap & Next Steps</h2>
        <ol className="roadmap-list">
          <li><strong>Q1:</strong> Improve multi-lingual resume parsing & bias mitigation.</li>
          <li><strong>Q2:</strong> Integrate calendar + interview booking + ATS connectors.</li>
          <li><strong>Q3:</strong> ML-backed candidate ranking for enterprise integration.</li>
          <li><strong>Ongoing:</strong> Security hardening, GDPR/PDPA compliance, and customer pilot programs.</li>
        </ol>
      </section>

      {/* ========================= CALL TO ACTION (HR) ========================= */}
      <section className="abt-card abt-cta fade-in">
        <h2 className="abt-section-title">Interested in a Pilot or Demo?</h2>
        <p className="abt-description">
          If you are a recruiter, placement officer, or product manager and want to evaluate a tailored
          pilot for your organization — let’s connect. We offer prototype integrations, CSV/ATS import,
          and a sandbox environment for pilot evaluation.
        </p>

        <div className="cta-row">
          <a className="cta-btn primary" href="mailto:gsiva@example.com?subject=Career%20Path%20Platform%20Demo">
            Request a Demo
          </a>
          <a className="cta-btn ghost" href="/contact">
            Contact Developer
          </a>
        </div>
      </section>

      {/* ========================= FOOTER PROFILE ========================= */}
      <section className="abt-card abt-personal-card fade-in">
        <h2 className="abt-section-title">Project Lead</h2>
        <p className="abt-description">
          <strong>G S S S Bhagavan</strong> — B.Tech (AI & Data Science). Passionate about building AI tools that
          help people make smarter career decisions. Available for collaborations, pilots, and placements support.
        </p>
        <div className="abt-profile highlight-box">
          <div><strong>Specialization:</strong> Artificial Intelligence & Data Science</div>
          <div><strong>Institution:</strong> Ramachandra College of Engineering</div>
          <div><strong>Location:</strong> Eluru, Andhra Pradesh, India</div>
          <div style={{ marginTop: 10 }}><strong>Email:</strong> gsiva@example.com</div>
        </div>
      </section>
    </main>
  );
}

export default About;
