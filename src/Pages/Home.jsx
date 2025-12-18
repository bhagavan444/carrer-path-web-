import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

/* ===========================
   Helper Components
=========================== */

// Animated KPI Counter
const AnimatedCounter = ({ end, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, 25);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.div
      className="counter-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3>{count}+</h3>
      <p>{label}</p>
    </motion.div>
  );
};

// Testimonials Slider
const Testimonials = () => {
  const data = [
    { text: "This platform helped me crack my first MNC job.", name: "Priya – Data Analyst" },
    { text: "Resume score improvement was eye-opening.", name: "Arjun – Software Engineer" },
    { text: "CareerBot feels like a personal mentor.", name: "Sneha – Cloud Engineer" }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % data.length), 4000);
    return () => clearInterval(t);
  }, [data.length]);

  return (
    <motion.div
      className="testimonial-box"
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p>“{data[index].text}”</p>
      <strong>{data[index].name}</strong>
    </motion.div>
  );
};

/* ===========================
   Main Home Component
=========================== */

const Home = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [resume, setResume] = useState(null);

  /* ---------- DARK MODE ---------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleResumeUpload = (file) => {
    setResume(file);
  };

  return (
    <main className="home-container">

      {/* DARK MODE TOGGLE */}
      <button
        className="dark-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* HERO */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>
          AI-Powered <span>Career Path Guidance</span>
        </h1>
        <p>
          Build job-ready skills, optimize your resume, and
          navigate your career like professionals in top MNCs.
        </p>

        <div className="hero-actions">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </motion.button>

          <motion.button
            className="btn-outline"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/quiz")}
          >
            Career Quiz
          </motion.button>
        </div>

        <div className="hero-stats">
          <AnimatedCounter end={1200} label="Careers Mapped" />
          <AnimatedCounter end={90} label="ATS Success Rate (%)" />
          <AnimatedCounter end={300} label="Skills Tracked" />
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        <h2>Why Smart Career Path?</h2>

        <div className="feature-grid">
          {[
            ["Resume Intelligence", "ATS-based resume scoring with role-specific feedback."],
            ["AI CareerBot", "24×7 assistance for career decisions and interview prep."],
            ["Skill Gap Analysis", "Know exactly what to learn for your dream role."],
            ["MNC-Ready Roadmap", "Step-by-step growth path used by professionals."]
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              className="feature-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* RESUME */}
      <motion.section
        className="resume-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2>Check Your Resume Instantly</h2>
        <p>Upload your resume and receive AI-driven insights.</p>

        <motion.div
          className="resume-box"
          whileHover={{ scale: 1.02 }}
          onClick={() => fileRef.current.click()}
        >
          {resume ? <strong>{resume.name}</strong> : "Click or Drag & Drop Resume"}
        </motion.div>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={(e) => handleResumeUpload(e.target.files[0])}
        />

        <button
          className="btn-primary"
          disabled={!resume}
          onClick={() => navigate("/predict")}
        >
          Analyze Resume
        </button>
      </motion.section>

      {/* ROADMAP */}
      <motion.section className="roadmap" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2>Your Career Journey</h2>
        <ul>
          <li>🎯 Choose Target Role</li>
          <li>📚 Learn Required Skills</li>
          <li>📄 Optimize Resume</li>
          <li>💼 Crack Interviews</li>
          <li>🚀 Career Growth</li>
        </ul>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section className="testimonials" whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <h2>What Users Say</h2>
        <Testimonials />
      </motion.section>

      {/* CTA */}
      <motion.section className="final-cta" whileInView={{ scale: 1 }} initial={{ scale: 0.95 }}>
        <h2>Start Your Career Like a Pro</h2>
        <p>Join students and professionals preparing for top companies.</p>
        <button className="btn-primary" onClick={() => navigate("/signup")}>
          Start Now
        </button>
      </motion.section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Smart Career Path</p>
      </footer>

    </main>
  );
};

export default Home;  