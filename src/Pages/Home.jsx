import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

/* ===========================
   Helpers
=========================== */

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
      whileHover={{ scale: 1.06 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <h3>{count}+</h3>
      <p>{label}</p>
    </motion.div>
  );
};

/* ===========================
   MAIN HOME
=========================== */

const Home = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user_profile"));

  const [resume, setResume] = useState(null);
  const [careerScore, setCareerScore] = useState(0);
  const [botOpen, setBotOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // New popup state

  /* ---------- DOMAIN & SKILLS ---------- */
  const domains = {
    "Software Engineering": ["DSA", "React", "Node.js", "SQL", "System Design"],
    "Data Science": ["Python", "ML", "Statistics", "Pandas", "SQL"],
    "AI / ML": ["Python", "Deep Learning", "TensorFlow", "Maths", "NLP"],
    "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD"],
    "Cyber Security": ["Networking", "Linux", "Ethical Hacking", "SIEM", "Cryptography"],
    "Business / MBA": ["Excel", "Analytics", "Strategy", "Communication", "Finance"]
  };

  const [selectedDomain, setSelectedDomain] = useState("Software Engineering");
  const [selectedSkills, setSelectedSkills] = useState([]);

  /* ---------- THEME ---------- */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ---------- CAREER READINESS ---------- */
  useEffect(() => {
    let score = 0;
    if (resume) score += 35;
    score += Math.min(selectedSkills.length * 10, 35);
    if (user) score += 30;
    setCareerScore(score);
  }, [resume, selectedSkills, user]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  /* ========== GET STARTED LOGIC ========== */
  const handleGetStarted = () => {
    if (user) {
      // Already logged in → go directly to predict
      navigate("/predict");
    } else {
      // Not logged in → show popup then redirect to login
      setShowLoginPrompt(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500); // Give time to read message
    }
  };

  return (
    <main className="home-container">

      {/* THEME TOGGLE */}
      <button
        className="dark-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      {/* HERO */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>
          {user ? `Welcome back, ${user.name}` : "Welcome to Path Nex - "}
          <span>Career Guidance</span>
        </h1>
        <p>
          A real-time career intelligence system used for
          students, professionals, and MNC-ready talent.
        </p>

        <div className="hero-actions">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.08 }}
            onClick={handleGetStarted} // Updated handler
          >
            Get Started
          </motion.button>

          <motion.button
            className="btn-outline"
            whileHover={{ scale: 1.08 }}
            onClick={() => navigate("/quiz")}
          >
            Career Quiz
          </motion.button>
        </div>

        <div className="hero-stats">
          <AnimatedCounter end={1200} label="Careers Mapped" />
          <AnimatedCounter end={90} label="ATS Success (%)" />
          <AnimatedCounter end={300} label="Skills Tracked" />
        </div>
      </motion.section>

      {/* CAREER READINESS */}
      <section className="readiness">
        <h2>Career Readiness Score</h2>
        <div className="readiness-bar">
          <motion.div
            className="readiness-fill"
            animate={{ width: `${careerScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p>{careerScore}% aligned with industry expectations</p>
      </section>

      {/* SKILL GAP – MULTI DOMAIN */}
      <section className="skills-sim">
        <h2>Skill Gap Simulator</h2>

        <select
          value={selectedDomain}
          onChange={(e) => {
            setSelectedDomain(e.target.value);
            setSelectedSkills([]);
          }}
        >
          {Object.keys(domains).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <div className="skill-list">
          {domains[selectedDomain].map((skill) => (
            <motion.button
              key={skill}
              whileHover={{ scale: 1.1 }}
              className={selectedSkills.includes(skill) ? "active" : ""}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </motion.button>
          ))}
        </div>

        <p>
          Skill Coverage: {selectedSkills.length}/{domains[selectedDomain].length}
        </p>
      </section>

      {/* RESUME */}
      <section className="resume-section">
        <h2>Resume Insights</h2>
        <motion.div
          className="resume-box"
          whileHover={{ scale: 1.03 }}
          onClick={() => fileRef.current.click()}
        >
          {resume ? resume.name : "Upload Resume"}
        </motion.div>

        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => setResume(e.target.files[0])}
        />

        {resume && (
          <ul className="resume-insights">
            <li>✔ ATS Score: 82%</li>
            <li>✔ Domain Match: {selectedDomain}</li>
            <li>✔ Missing Skills: {domains[selectedDomain]
              .filter((s) => !selectedSkills.includes(s))
              .slice(0, 2)
              .join(", ")}</li>
          </ul>
        )}
      </section>

      {/* ROADMAP – REALTIME */}
      <section className="roadmap">
        <h2>Industry Career Roadmap</h2>
        <div className="timeline">
          {["Foundation", "Skill Mastery", "Projects", "Internships", "MNC Role"].map(
            (step, i) => (
              <motion.div
                key={step}
                className="timeline-step"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity }}
              >
                {step}
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="badges">
        <h2>Professional Achievements</h2>
        <div className="badge-list">
          {resume && <span>📄 Resume Verified</span>}
          {selectedSkills.length >= 3 && <span>🧠 Skill Explorer</span>}
          {selectedSkills.length >= 5 && <span>🏆 Domain Specialist</span>}
          {careerScore >= 80 && <span>🚀 MNC-Ready Talent</span>}
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <p>✔ Role-Based Skill Mapping</p>
        <p>✔ Education-Independent Career Paths</p>
        <p>✔ Enterprise Hiring Standards</p>
      </section>

      {/* CAREERBOT */}
      <button className="careerbot-fab" onClick={() => setBotOpen(true)}>
        🤖
      </button>

      <AnimatePresence>
        {botOpen && (
          <motion.div
            className="bot-modal"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3>CareerBot</h3>
            <p>Ask career questions across all domains.</p>
            <button onClick={() => navigate("/chat")}>Open Assistant</button>
            <button onClick={() => setBotOpen(false)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN PROMPT POPUP */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="login-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="login-prompt-card"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h3>🔐 Login Required</h3>
              <p>To access personalized predictions and resume analysis, please log in first.</p>
              <p>Redirecting you to login page...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="footer enterprise-footer">
        <div className="footer-grid">
          <div>
            <h4>PathNex</h4>
            <p>Universal career intelligence platform.</p>
          </div>
          <div>
            <h5>Domains</h5>
            <p>Engineering</p>
            <p>Data & AI</p>
            <p>Business</p>
          </div>
          <div>
            <h5>Education</h5>
            <p>B.Tech / B.Sc</p>
            <p>MBA / MCA</p>
            <p>Diploma</p>
          </div>
          <div>
            <h5>Standards</h5>
            <p>MNC Hiring</p>
            <p>ATS Systems</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} PathNex. Career Intelligence Engine.
        </div>
      </footer>

    </main>
  );
};

export default Home;