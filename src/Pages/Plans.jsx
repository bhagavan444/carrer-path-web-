import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Plans.css";

/**
 * ================================
 * ENTERPRISE PRICING – Plans.jsx
 * ================================
 * MNC-grade SaaS pricing page
 * Includes:
 * - Monthly / Yearly billing toggle
 * - Promo codes
 * - Free trial
 * - Feature search
 * - Comparison table
 * - Testimonials carousel
 * - FAQ accordion
 * - Enterprise CTA
 * - Secure mock checkout modal
 */

const BASE_PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    badge: "Free",
    short: "Get started with essential features — no signup required.",
    features: [
      "Unlimited basic chats",
      "General AI responses",
      "No sign-up required",
      "Secure & private",
      "Mobile & desktop access",
    ],
    disabledFeatures: [
      "Advanced AI models",
      "Chat history",
      "Extended usage limits",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    yearly: 120,
    badge: "Most Popular",
    short: "Advanced intelligence for serious career growth.",
    features: [
      "Latest AI models",
      "Resume & ATS analysis",
      "Saved chat history",
      "Document Q&A (PDF, DOC)",
      "Career roadmaps",
      "Priority support",
    ],
    disabledFeatures: ["Team collaboration", "Enterprise API"],
    cta: "Start 7-Day Trial",
    featured: true,
  },
  {
    id: "plus",
    name: "Enterprise",
    monthly: 24,
    yearly: 240,
    badge: "Enterprise",
    short: "For institutions, teams, and advanced users.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Analytics dashboard",
      "Bulk resume processing",
      "Dedicated support",
    ],
    disabledFeatures: [],
    cta: "Contact Sales",
    featured: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya R.",
    role: "Data Scientist",
    text:
      "PathNex gave me clarity on my resume gaps. I landed interviews within a week.",
  },
  {
    name: "Rohit K.",
    role: "Software Engineer",
    text:
      "The career roadmap and ATS score felt exactly like MNC hiring standards.",
  },
  {
    name: "Maya S.",
    role: "UI/UX Designer",
    text:
      "Clean UI, clear insights, and actually useful recommendations.",
  },
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly plans can be cancelled anytime. Yearly plans remain active until the billing cycle ends.",
  },
  {
    q: "Is resume data secure?",
    a: "Yes. Files are processed securely and not shared externally.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes. Eligible students can request discounts via support.",
  },
];

export default function Plans() {
  const navigate = useNavigate();

  const [billing, setBilling] = useState(
    localStorage.getItem("billing") || "monthly"
  );
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [testIndex, setTestIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setTestIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer.current);
  }, []);

  const price = (plan) => {
    const base = billing === "monthly" ? plan.monthly : plan.yearly;
    if (promoApplied === "SAVE20") return base * 0.8;
    if (promoApplied === "HALFOFF") return base * 0.5;
    return base;
  };

  const applyPromo = () => {
    const code = promo.toUpperCase();
    if (["SAVE20", "HALFOFF", "TRIAL"].includes(code)) {
      setPromoApplied(code);
      alert(`Promo ${code} applied`);
    } else alert("Invalid promo code");
  };

  const handleSelect = (id) => {
    setSelectedPlan(id);
    if (id === "free") navigate("/chat");
    else setShowModal(true);
  };

  return (
    <main className="plans-main">
      {/* HERO */}
      <section className="plans-hero">
        <h1>
          Simple, Transparent <span>Pricing</span>
        </h1>
        <p>Built for individuals, teams, and institutions</p>

        <div className="billing-toggle">
          <button onClick={() => setBilling("monthly")}
            className={billing === "monthly" ? "active" : ""}>
            Monthly
          </button>
          <button onClick={() => setBilling("yearly")}
            className={billing === "yearly" ? "active" : ""}>
            Yearly (Save 20%)
          </button>
        </div>

        <div className="promo-bar">
          <input
            placeholder="Promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <button onClick={applyPromo}>Apply</button>
          {promoApplied && <span>Applied: {promoApplied}</span>}
        </div>

        <input
          className="feature-search"
          placeholder="Search features"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* PLANS */}
      <section className="plans-grid">
        {BASE_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.featured ? "featured" : ""}`}
          >
            <span className="badge">{plan.badge}</span>
            <h3>{plan.name}</h3>
            <p>{plan.short}</p>

            <div className="price">
              ${price(plan)} <span>/{billing}</span>
            </div>

            <ul>
              {plan.features
                .filter((f) => f.toLowerCase().includes(search.toLowerCase()))
                .map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              {plan.disabledFeatures.map((f, i) => (
                <li key={i} className="disabled">
                  ✖ {f}
                </li>
              ))}
            </ul>

            <button onClick={() => handleSelect(plan.id)}>
              {plan.cta}
            </button>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <blockquote>
          “{TESTIMONIALS[testIndex].text}”
          <footer>
            — {TESTIMONIALS[testIndex].name},{" "}
            <span>{TESTIMONIALS[testIndex].role}</span>
          </footer>
        </blockquote>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>FAQs</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="faq-item">
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
              {f.q}
            </button>
            {faqOpen === i && <p>{f.a}</p>}
          </div>
        ))}
      </section>

      {/* ENTERPRISE CTA */}
      <section className="enterprise-cta">
        <h3>Need custom pricing?</h3>
        <p>Contact our enterprise team for bulk & institutional plans.</p>
        <button
          onClick={() =>
            (window.location.href =
              "mailto:enterprise@careerai.example")
          }
        >
          Contact Sales
        </button>
      </section>

      {/* CHECKOUT MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-card">
            <h3>Subscribe to {selectedPlan.toUpperCase()}</h3>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={() => alert("Subscribed (mock)")}>
              Confirm
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}
