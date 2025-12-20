import React from "react";
import { motion } from "framer-motion";
import "./About.css";

function About() {
  return (
    <main className="abt-main">

      {/* ========================= HERO ========================= */}
      <section className="abt-hero">
        <div className="abt-hero-inner">

          {/* BRAND BLOCK (NO FACE ICON) */}
          <motion.div
            className="abt-brand-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="brand-mark">PN</div>
            <div className="brand-text">
              <h2>PathNex</h2>
              <span>Career Intelligence</span>
            </div>
          </motion.div>

          <motion.div
            className="abt-intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="abt-name">PathNex – Career Intelligence Platform</h1>

            <p className="abt-title">
              <span className="gradient-text">
                AI-Driven Career Guidance • Resume Intelligence • Skill Gap Analysis
              </span>
            </p>

            <div className="abt-location">
              <span><strong>Platform Type:</strong> Career Intelligence & Decision Support</span><br />
              <span><strong>Primary Users:</strong> Students, Professionals, Institutions</span><br />
              <span><strong>Developed By:</strong> G S S S Bhagavan</span>
            </div>

            <blockquote className="abt-quote">
              “Designed to reduce uncertainty in career decisions through structured,
              data-driven insights aligned with industry standards.”
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ========================= TRUST METRICS ========================= */}
      <section className="abt-metrics">
        {[
          ["ATS-Aligned", "Resume evaluation mapped to hiring systems"],
          ["Multi-Domain", "Engineering, AI, Data & Business"],
          ["Scalable Design", "Built with modular architecture"],
          ["Enterprise UX", "Product-company design standards"]
        ].map(([title, desc], i) => (
          <motion.div
            key={i}
            className="metric-card"
            whileHover={{ y: -6 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3>{title}</h3>
            <p>{desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ========================= PROBLEM CONTEXT ========================= */}
      <motion.section className="abt-card" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2 className="abt-section-title">Problem Context</h2>
        <p className="abt-description">
          Career planning is often fragmented — unclear role expectations, unstructured
          resume reviews, and lack of measurable readiness indicators.
        </p>
        <p className="abt-description">
          PathNex acts as a decision-support system by combining resume intelligence,
          skill mapping, and role-based roadmaps into one unified workflow.
        </p>
      </motion.section>

      {/* ========================= PLATFORM CAPABILITIES ========================= */}
      <motion.section className="abt-card" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2 className="abt-section-title">Platform Capabilities</h2>

        <div className="capability-grid">
          <div className="capability-card">
            <h3>Resume Intelligence</h3>
            <p>Skill extraction, ATS keyword alignment, readiness scoring.</p>
          </div>
          <div className="capability-card">
            <h3>Career Readiness</h3>
            <p>Quantified readiness indicators aligned with industry roles.</p>
          </div>
          <div className="capability-card">
            <h3>Skill Gap Analysis</h3>
            <p>Highlights missing competencies per selected domain.</p>
          </div>
          <div className="capability-card">
            <h3>CareerBot Assistant</h3>
            <p>AI-based contextual guidance and interview preparation.</p>
          </div>
        </div>
      </motion.section>

      {/* ========================= USE CASES ========================= */}
      <motion.section className="abt-card" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2 className="abt-section-title">Intended Use Cases</h2>

        <div className="usecase-grid">
          <div className="usecase">Students & Fresh Graduates</div>
          <div className="usecase">Training & Placement Cells</div>
          <div className="usecase">Early-Career Professionals</div>
          <div className="usecase">HR / L&D Prototypes</div>
        </div>
      </motion.section>

      {/* ========================= TECH STACK ========================= */}
      <motion.section className="abt-card" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2 className="abt-section-title">Technical Architecture</h2>

        <div className="tech-grid">
          <div className="tech"><strong>Frontend</strong><div>React, CSS, Framer Motion</div></div>
          <div className="tech"><strong>Backend</strong><div>Flask, REST APIs</div></div>
          <div className="tech"><strong>AI Logic</strong><div>NLP-based parsing & matching</div></div>
          <div className="tech"><strong>Data</strong><div>Structured skill datasets</div></div>
        </div>
      </motion.section>

      {/* ========================= ROADMAP ========================= */}
      <motion.section className="abt-card" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2 className="abt-section-title">Planned Enhancements</h2>
        <ol className="roadmap-list">
          <li>Advanced resume format handling</li>
          <li>Role-specific interview simulations</li>
          <li>Career progress analytics dashboard</li>
          <li>Production-grade security hardening</li>
        </ol>
      </motion.section>

      {/* ========================= FOOTER ========================= */}
      <footer className="abt-footer">
        <p>© {new Date().getFullYear()} PathNex • Career Intelligence Platform</p>
        <p>Designed with enterprise UX & hiring standards in mind</p>
      </footer>

    </main>
  );
}

export default About;
