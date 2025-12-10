import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

/**
 * Home.jsx - Enhanced Home component for Smart Career Path
 * - Lots of interactive UI features to impress HR and recruiters
 * - Keep CSS in Home.css (class names already used below)
 */

/* ----------------------------- Small Helper Components ----------------------------- */

// Animated Counter for hero stats
function AnimatedCounter({ end, duration = 1500, label }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(10, Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setValue(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration]);
  return (
    <div className="counter-card" aria-hidden="false">
      <div className="counter-value">{value}{end >= 100 && value === end ? "+" : ""}</div>
      <div className="counter-label">{label}</div>
    </div>
  );
}

// Simple testimonial carousel
function TestimonialCarousel({ items, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items.length, interval]);

  return (
    <div className="testimonial-carousel" role="region" aria-label="User testimonials">
      {items.map((it, i) => (
        <figure
          key={i}
          className={`testimonial-item ${i === index ? "active" : "hidden"}`}
          aria-hidden={i === index ? "false" : "true"}
        >
          <blockquote>{it.quote}</blockquote>
          <figcaption>- {it.author}</figcaption>
        </figure>
      ))}
      <div className="testimonial-controls">
        {items.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

// Pricing toggle component
function PricingToggle({ onSelect }) {
  const [billing, setBilling] = useState("monthly");
  useEffect(() => onSelect && onSelect(billing), [billing, onSelect]);
  return (
    <div className="pricing-toggle" role="tablist" aria-label="Billing toggle">
      <button
        role="tab"
        aria-selected={billing === "monthly"}
        className={billing === "monthly" ? "selected" : ""}
        onClick={() => setBilling("monthly")}
      >
        Monthly
      </button>
      <button
        role="tab"
        aria-selected={billing === "yearly"}
        className={billing === "yearly" ? "selected" : ""}
        onClick={() => setBilling("yearly")}
      >
        Yearly (save 20%)
      </button>
    </div>
  );
}

// FAQ accordion
function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-accordion" role="region" aria-label="Frequently asked questions">
      {faqs.map((f, i) => (
        <div key={i} className="faq-item">
          <button
            className="faq-question"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <span className="faq-toggle">{open === i ? "−" : "+"}</span>
          </button>
          <div className={`faq-answer ${open === i ? "open" : ""}`} aria-hidden={open === i ? "false" : "true"}>
            {f.a}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Main Home Component ----------------------------- */

function Home() {
  const navigate = useNavigate();

  // Hero / newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  // Demo modal
  const [isDemoOpen, setDemoOpen] = useState(false);

  // Pricing selection
  const [billing, setBilling] = useState("monthly");

  // Resume upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const resumeInputRef = useRef(null);

  // Chat drawer
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi — I'm CareerBot. Ask me about resume tips, interview prep, or career paths." },
  ]);
  const [chatText, setChatText] = useState("");

  // Testimonials data
  const testimonials = [
    { quote: "This platform transformed my career. The AI guidance helped me land my dream job!", author: "Priya, Data Scientist" },
    { quote: "The CareerBot is like having a personal mentor available 24/7.", author: "Arjun, Software Engineer" },
    { quote: "I closed my skill gaps quickly and earned certifications that boosted my career growth.", author: "Sneha, Cloud Specialist" },
  ];

  // FAQs
  const faqs = [
    { q: "Is my data safe?", a: "Yes — we use industry-standard encryption, secure storage, and strict access controls to keep your information safe." },
    { q: "How is career guidance personalized?", a: "Our AI analyzes your resume, skills, certifications, job history, and stated goals to build an individualized pathway." },
    { q: "Can I cancel anytime?", a: "Yes — change or cancel your subscription from the account page at any time; you won't be billed next cycle." },
  ];

  useEffect(() => {
    // small "analytics" for hero CTA impressions
    console.log("Home: render - hero visible");
  }, []);

  /* ----------------------------- Newsletter Submission ----------------------------- */
  const handleNewsletterSubmit = async (e) => {
    e && e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      setNewsletterMessage("Please enter a valid email.");
      setTimeout(() => setNewsletterMessage(""), 3000);
      return;
    }
    try {
      setSubmittingNewsletter(true);
      // Mock API call - replace with real endpoint as needed
      await new Promise((res) => setTimeout(res, 800));
      // Example: await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email: newsletterEmail }) })
      setNewsletterMessage("Thanks — you'll receive updates to your inbox!");
      console.log("Newsletter subscribed:", newsletterEmail);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setNewsletterMessage("Subscription failed. Try again later.");
      setTimeout(() => setNewsletterMessage(""), 3000);
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  /* ----------------------------- Resume Upload (drag & drop) ----------------------------- */
  const onDropResume = (file) => {
    if (!file) return;
    setUploadedFile(file);
    // If you want to navigate and pass file to /predict, you could use context or upload to server
    console.log("Resume uploaded (preview):", file.name);
  };

  const handleFileChange = (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (f) onDropResume(f);
  };

  const handlePredictNow = () => {
    // If you have an API, upload file. For now, just navigate to /predict (the component there can read from context or prompt again).
    navigate("/predict", { state: { uploadedFileName: uploadedFile ? uploadedFile.name : null } });
  };

  /* ----------------------------- Demo Modal ----------------------------- */
  const DemoModal = () => (
    isDemoOpen ? (
      <div className="demo-modal" role="dialog" aria-modal="true" aria-label="Product demo video">
        <div className="demo-modal-inner">
          <button className="demo-close" onClick={() => setDemoOpen(false)} aria-label="Close demo">✕</button>
          <div className="demo-video-wrapper">
            {/* Replace the src with your demo video if hosted */}
            <iframe
              title="Demo video"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/oY5bqTgUFmY?autoplay=1"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    ) : null
  );

  /* ----------------------------- Chat (simulated) ----------------------------- */
  const sendChat = () => {
    if (!chatText.trim()) return;
    const userMsg = { from: "user", text: chatText.trim() };
    setChatMessages((m) => [...m, userMsg]);
    setChatText("");
    // Simulated bot response
    setTimeout(() => {
      setChatMessages((m) => [...m, { from: "bot", text: "Great question! I recommend uploading your resume for a quick review." }]);
    }, 600);
  };

  return (
    <main className="homepage-main enhanced">
      {/* Hero Section */}
      <section className="homepage-hero-section enhanced-hero">
        <div className="homepage-hero-content">
          <h1 className="homepage-hero-title">
            Elevate Your Career with{" "}
            <span className="homepage-highlight">AI-Enhanced Guidance</span>
          </h1>
          <p className="homepage-hero-subtitle">
            Personalized career pathways, in-depth skill evaluations, and AI-driven support that works 24/7.
          </p>

          <div className="homepage-hero-cta-row">
            <button
              className="homepage-btn homepage-get-started"
              onClick={() => {
                console.log("CTA: Begin Your Journey clicked");
                navigate("/plans");
              }}
              aria-label="Begin your journey"
            >
              Begin Your Journey
            </button>

            <button
              className="homepage-btn homepage-outline"
              onClick={() => setDemoOpen(true)}
              aria-label="Watch demo"
            >
              ▶ Watch Demo
            </button>

            <button
              className="homepage-btn homepage-ghost"
              onClick={() => navigate("/quiz")}
              aria-label="Start career quiz"
            >
              Start Career Quiz
            </button>
          </div>

          {/* quick stats */}
          <div className="hero-stats" role="list" aria-label="Platform achievements">
            <AnimatedCounter end={1200} label="Jobs Mapped" />
            <AnimatedCounter end={95} label="Certifications Recommended" />
            <AnimatedCounter end={87} label="% Interview Success Rate" />
          </div>
        </div>
      </section>

      {/* Features + Demo */}
      <section className="homepage-features-section enhanced-features">
        <h2 className="homepage-section-title">Why Partner with Smart Career Path?</h2>
        <div className="homepage-features-grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Advanced Resume Analysis</h3>
            <p>AI-driven scoring, keyword optimization, ATS simulation and suggested rewrites.</p>
            <button className="link-button" onClick={() => navigate("/predict")}>Try Resume Check</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Intelligent CareerBot</h3>
            <p>24/7 chat assistance for interview practice, role-fit analysis and application strategy.</p>
            <button className="link-button" onClick={() => setChatOpen(true)}>Chat Now</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Skill Gap Optimization</h3>
            <p>Personalized learning paths, micro-certifications, and progress tracking.</p>
            <button className="link-button" onClick={() => navigate("/courses")}>View Courses</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Robust Data Security</h3>
            <p>GDPR-ready controls, encrypted storage, and strict access policies.</p>
            <button className="link-button" onClick={() => navigate("/privacy")}>Privacy Details</button>
          </div>
        </div>
      </section>

      {/* Upload Resume / Quick Predict */}
      <section className="homepage-resume-section enhanced-resume" aria-labelledby="resume-heading">
        <div className="resume-left">
          <h2 id="resume-heading">Get a Resume Score in Seconds</h2>
          <p>Upload your resume and receive instant feedback plus an action plan.</p>

          <div
            className="resume-dropzone"
            onClick={() => resumeInputRef.current && resumeInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files && e.dataTransfer.files[0];
              if (f) onDropResume(f);
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload or drop your resume"
          >
            {uploadedFile ? (
              <div className="resume-preview">
                <strong>{uploadedFile.name}</strong>
                <small>{(uploadedFile.size / 1024).toFixed(1)} KB</small>
                <div className="resume-actions">
                  <button onClick={() => resumeInputRef.current && resumeInputRef.current.click()}>Replace</button>
                  <button onClick={() => setUploadedFile(null)}>Remove</button>
                </div>
              </div>
            ) : (
              <div className="resume-empty">Drag & drop your resume here or click to browse</div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
              aria-hidden="true"
            />
          </div>

          <div className="resume-cta-row">
            <button
              className="homepage-btn homepage-get-started"
              onClick={handlePredictNow}
              aria-label="Check my resume"
            >
              Check My Resume
            </button>

            <button
              className="homepage-btn homepage-outline"
              onClick={() => {
                // mock sample resume download
                const sample = new Blob(["Sample Resume\nName: Jane Doe\n..."], { type: "text/plain" });
                const url = URL.createObjectURL(sample);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Sample_Resume.txt";
                a.click();
                URL.revokeObjectURL(url);
                console.log("Sample resume downloaded");
              }}
              aria-label="Download sample resume"
            >
              Download Sample
            </button>
          </div>
        </div>

        <div className="resume-right">
          <h3>What we analyze</h3>
          <ul>
            <li>ATS compliance & keyword match</li>
            <li>Role-fit score vs chosen role</li>
            <li>Suggested bullet rewrites</li>
            <li>Certifications & skill gaps</li>
          </ul>
          <p className="small-note">Pro tip: Use bullet points and action verbs for better scoring.</p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="homepage-roadmap-section enhanced-roadmap">
        <h2 className="homepage-section-title">Your Career Roadmap</h2>
        <div className="roadmap-steps">
          {[
            { title: "Choose Your Target Role", progress: 80 },
            { title: "Learn Essential Skills", progress: 55 },
            { title: "Earn Certifications", progress: 35 },
            { title: "Apply for Jobs", progress: 10 },
            { title: "Achieve Career Growth", progress: 5 },
          ].map((s, i) => (
            <div key={i} className="roadmap-step" aria-label={s.title}>
              <div className="roadmap-step-header">
                <span className="roadmap-step-index">{i + 1}</span>
                <h4>{s.title}</h4>
                <span className="roadmap-step-progress">{s.progress}%</span>
              </div>
              <div className="progress-bar" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="homepage-how-section enhanced-how">
        <h2 className="homepage-section-title">How It Works</h2>
        <ol className="how-steps" aria-label="How the platform works">
          <li><strong>Upload</strong> your resume</li>
          <li><strong>AI analyzes</strong> your skills & role fit</li>
          <li><strong>Get personalized</strong> learning & certification plan</li>
          <li><strong>Apply</strong> with improved resumes & interview prep</li>
          <li><strong>Track progress</strong> and collect offers</li>
        </ol>
      </section>

      {/* Learning Recommendations */}
      <section className="homepage-learning-section enhanced-learning">
        <h2 className="homepage-section-title">Recommended Learning Resources</h2>
        <div className="learning-list">
          <div className="learning-card">
            <h4>Python for Data Science</h4>
            <p>Short path with projects & certificates.</p>
            <button onClick={() => navigate("/courses")}>Explore</button>
          </div>
          <div className="learning-card">
            <h4>AWS Cloud Practitioner</h4>
            <p>Foundational cloud skills for many roles.</p>
            <button onClick={() => navigate("/courses")}>Explore</button>
          </div>
          <div className="learning-card">
            <h4>Machine Learning Basics</h4>
            <p>Build models and deploy them.</p>
            <button onClick={() => navigate("/courses")}>Explore</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="homepage-testimonials-section enhanced-testimonials">
        <h2 className="homepage-section-title">What Our Users Say</h2>
        <TestimonialCarousel items={testimonials} />
      </section>

      {/* Pricing Snapshot */}
      <section className="homepage-pricing-section enhanced-pricing" aria-label="Pricing">
        <h2 className="homepage-section-title">Choose Your Plan</h2>
        <PricingToggle onSelect={(b) => setBilling(b)} />
        <div className="pricing-list">
          {/* Free */}
          <div className="pricing-card">
            <h3>Free</h3>
            <p className="price">{billing === "monthly" ? "Free" : "Free"}</p>
            <ul>
              <li>Basic Resume Check</li>
              <li>Career Suggestions</li>
            </ul>
            <button onClick={() => navigate("/signup")}>Get Started</button>
          </div>

          {/* Pro */}
          <div className="pricing-card recommended">
            <div className="badge">Most Popular</div>
            <h3>Pro</h3>
            <p className="price">{billing === "monthly" ? "$12/mo" : "$9/mo billed yearly"}</p>
            <ul>
              <li>Advanced Resume Analysis</li>
              <li>CareerBot Access</li>
              <li>Interview Prep</li>
            </ul>
            <button onClick={() => navigate("/plans")}>Upgrade</button>
          </div>

          {/* Premium */}
          <div className="pricing-card">
            <h3>Premium</h3>
            <p className="price">{billing === "monthly" ? "$29/mo" : "$24/mo billed yearly"}</p>
            <ul>
              <li>Full Career Guidance</li>
              <li>1:1 Mentorship Sessions</li>
              <li>Certifications Roadmap</li>
            </ul>
            <button onClick={() => navigate("/plans")}>Go Premium</button>
          </div>
        </div>
      </section>

      {/* Blog & Insights */}
      <section className="homepage-blog-section enhanced-blog">
        <h2 className="homepage-section-title">Insights & Blogs</h2>
        <div className="blog-list">
          <article className="blog-card" onClick={() => navigate("/blog/top-skills-2025")}>
            <h3>Top 5 Skills for 2025</h3>
            <p>Stay ahead with the most in-demand skills and where to learn them.</p>
          </article>
          <article className="blog-card" onClick={() => navigate("/blog/ai-career-planning")}>
            <h3>AI in Career Planning</h3>
            <p>How artificial intelligence shapes hiring and career growth.</p>
          </article>
        </div>
        <button className="homepage-btn homepage-outline" onClick={() => navigate("/blog")}>View All Articles</button>
      </section>

      {/* FAQ Section */}
      <section className="homepage-faq-section enhanced-faq">
        <h2 className="homepage-section-title">Frequently Asked Questions</h2>
        <FAQAccordion faqs={faqs} />
      </section>

      {/* Final CTA */}
      <section className="homepage-final-cta enhanced-cta">
        <h2>Ready to Transform Your Career?</h2>
        <div className="cta-row">
          <button className="homepage-btn homepage-get-started" onClick={() => navigate("/signup")}>Get Started Now</button>
          <button className="homepage-btn homepage-outline" onClick={() => setDemoOpen(true)}>Watch Quick Demo</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer enhanced-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Smart Career Path</h3>
            <p>Empowering your career with AI-driven insights and personalized guidance.</p>
            <div className="footer-social">
              <a href="https://x.com" aria-label="Follow on X Platform" target="_blank" rel="noreferrer">𝕏</a>
              <a href="https://www.linkedin.com" aria-label="Follow on LinkedIn" target="_blank" rel="noreferrer">🔗</a>
              <a href="https://github.com" aria-label="Follow on GitHub" target="_blank" rel="noreferrer">🐙</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => navigate("/")} className="link-button">Home</button></li>
              <li><button onClick={() => navigate("/predict")} className="link-button">Resume Analysis</button></li>
              <li><button onClick={() => navigate("/quiz")} className="link-button">Career Quiz</button></li>
              <li><button onClick={() => navigate("/plans")} className="link-button">Pricing</button></li>
              <li><button onClick={() => navigate("/blog")} className="link-button">Blog</button></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p><a href="mailto:support@smartcareerpath.com">support@smartcareerpath.com</a></p>
            <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
            <div className="newsletter-mini">
              <form onSubmit={handleNewsletterSubmit} aria-label="Subscribe to newsletter">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  aria-label="Email for newsletter"
                />
                <button type="submit" disabled={submittingNewsletter}>
                  {submittingNewsletter ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {newsletterMessage && <div className="newsletter-msg" role="status">{newsletterMessage}</div>}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Smart Career Path. All rights reserved.</p>
          <div className="footer-legal">
            <button onClick={() => navigate("/privacy")} className="link-button">Privacy Policy</button>
            <button onClick={() => navigate("/terms")} className="link-button">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* Demo modal */}
      <DemoModal />

      {/* Floating Chat */}
      <div className={`floating-chat ${chatOpen ? "open" : ""}`} aria-hidden={!chatOpen}>
        <div className="chat-header">
          <strong>CareerBot</strong>
          <button aria-label="Close chat" onClick={() => setChatOpen(false)}>✕</button>
        </div>
        <div className="chat-body" role="log" aria-live="polite">
          {chatMessages.map((m, i) => (
            <div key={i} className={`chat-message ${m.from === "bot" ? "bot" : "user"}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            placeholder="Ask me for resume tips..."
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            aria-label="Chat input"
          />
          <button onClick={sendChat} aria-label="Send chat">Send</button>
        </div>
      </div>

      {/* Floating Chat button */}
      <button
        className="floating-chat-button"
        aria-label="Open CareerBot chat"
        onClick={() => setChatOpen(true)}
      >
        💬
      </button>
    </main>
  );
}

export default Home;
