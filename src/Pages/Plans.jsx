import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Enhanced Plans.jsx
 * - Billing toggle (monthly/yearly) with discount applied
 * - Promo code support
 * - 7-day trial CTA
 * - Subscribe modal (mock)
 * - Testimonials carousel
 * - Feature search & improved UI
 * - FAQ accordion
 */

const BASE_PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    badge: "Free",
    short: "Great to start — basic chat features and no sign-up.",
    features: [
      "Unlimited basic chats",
      "General AI responses",
      "No sign-up required",
      "Secure & Private",
      "Mobile & desktop access",
    ],
    disabledFeatures: [
      "Premium AI models",
      "Saved chat history",
      "Extended daily quota",
    ],
    cta: "Start For Free",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    yearly: 120,
    badge: "Most Popular",
    short: "Boost productivity — advanced models, history, and priority support.",
    features: [
      "Access to latest AI models",
      "Priority customer support",
      "Save & organize conversation history",
      "Code & Math problem solving",
      "Advanced document Q&A (PDF, Word)",
      "Multi-device sync",
    ],
    disabledFeatures: ["Team collaboration", "Enterprise API"],
    cta: "Try 7-day Free Trial",
    featured: true,
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 24,
    yearly: 240,
    badge: "Plus",
    short: "For power users & teams — collaboration, analytics, and API access.",
    features: [
      "Everything in Pro",
      "Faster responses & reliability",
      "Team collaboration spaces",
      "API access for developers",
      "Extended memory & context window",
      "Analytics dashboard",
      "Export chats (PDF, Word, Excel)",
    ],
    disabledFeatures: [],
    cta: "Notify Me",
    featured: false,
  },
];

const TESTIMONIALS = [
  { id: 1, name: "Ananya R.", role: "Data Scientist", text: "Pro helped me tailor my resume and prepare for interviews — got my first interview within a week!" },
  { id: 2, name: "Rohit K.", role: "Software Engineer", text: "The PDF Q&A and chat history are game changers for debugging and docs." },
  { id: 3, name: "Maya S.", role: "UI/UX Designer", text: "I loved the skill-gap suggestions and roadmap. Easy to follow and actionable." },
];

const FAQ = [
  { q: "Can I cancel my subscription anytime?", a: "Yes — monthly subscriptions can be cancelled at any time. Yearly subscriptions will not be prorated on cancellation." },
  { q: "Do you offer student discounts?", a: "Yes — we offer student discounts. Contact us at support@careerai.example to apply." },
  { q: "Is my resume data private?", a: "Absolutely. Uploaded files are processed securely and removed after analysis unless you save them explicitly." },
];

export default function Plans() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState(() => localStorage.getItem("billingCycle") || "monthly");
  const [plans, setPlans] = useState(BASE_PLANS);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(() => localStorage.getItem("selectedPlan") || "free");
  const [showModal, setShowModal] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [testIndex, setTestIndex] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const testimonialTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("billingCycle", billingCycle);
  }, [billingCycle]);

  useEffect(() => {
    localStorage.setItem("selectedPlan", selectedPlan);
  }, [selectedPlan]);

  // Auto-rotate testimonials
  useEffect(() => {
    testimonialTimerRef.current = setInterval(() => {
      setTestIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(testimonialTimerRef.current);
  }, []);

  const computePrice = (plan) => {
    const base = billingCycle === "monthly" ? plan.monthly : plan.yearly;
    let final = base;
    // Promo: example codes:
    // SAVE20 -> 20% off, TRIAL -> free first 7 days for Pro only
    if (promoApplied === "SAVE20") final = +(final * 0.8).toFixed(2);
    if (promoApplied === "HALFOFF") final = +(final * 0.5).toFixed(2);
    return final;
  };

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return alert("Enter a promo code.");
    // simple demo validation
    if (code === "SAVE20" || code === "HALFOFF" || code === "TRIAL") {
      setPromoApplied(code);
      alert(`Promo ${code} applied!`);
    } else {
      setPromoApplied(null);
      alert("Invalid promo code.");
    }
  };

  const handleSubscribeClick = (planId) => {
    setSelectedPlan(planId);
    // If free plan -> direct navigation or login flow
    if (planId === "free") {
      // "Start for Free" navigates to chat or signup
      navigate("/chat");
    } else {
      setShowModal(true);
    }
  };

  const confirmCheckout = () => {
    // Mock checkout: validate email and promo rules
    if (!checkoutEmail.includes("@")) return alert("Please enter a valid email.");
    // special promo TRIAL for Pro
    if (promoApplied === "TRIAL" && selectedPlan === "pro") {
      alert("✅ 7-day FREE trial started for Pro! Check your email for details (mock).");
      setShowModal(false);
      return;
    }
    const price = computePrice(plans.find(p => p.id === selectedPlan));
    alert(`✅ Subscribed (mock)\nPlan: ${selectedPlan.toUpperCase()}\nBilling: ${billingCycle}\nAmount: $${price}\nReceipt sent to: ${checkoutEmail}`);
    setShowModal(false);
  };

  const contactEnterprise = () => {
    const subject = encodeURIComponent("Enterprise pricing / trial request");
    const body = encodeURIComponent("Hello team,\n\nI am interested in enterprise pricing and a trial for multiple users. Please contact me.\n\nRegards,\n");
    window.location.href = `mailto:enterprise@careerai.example?subject=${subject}&body=${body}`;
  };

  const filtered = plans.map(plan => {
    // filter features by query
    if (!filterQuery.trim()) return plan;
    const q = filterQuery.toLowerCase();
    const matchFeatures = plan.features.filter(f => f.toLowerCase().includes(q));
    const matchName = plan.name.toLowerCase().includes(q) || plan.short.toLowerCase().includes(q);
    return { ...plan, features: matchFeatures, _hidden: !matchFeatures.length && !matchName };
  }).filter(p => !p._hidden);

  return (
    <main className="plans-main" style={{ padding: 24 }}>
      <section className="plans-hero">
        <h1>
          Choose Your <span className="plans-highlight">ChatBot</span> Plan
        </h1>
        <p className="plans-subtitle">
          From casual chatting to advanced AI features — pick the plan that suits your needs.
        </p>

        <div className="controls-row" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
          <div className="pricing-toggle" role="tablist" aria-label="Billing cycle">
            <button
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
            >
              Monthly
            </button>
            <button
              className={billingCycle === "yearly" ? "active" : ""}
              onClick={() => setBillingCycle("yearly")}
              aria-pressed={billingCycle === "yearly"}
            >
              Yearly - Save 20%
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Promo code (SAVE20 / HALFOFF / TRIAL)"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              aria-label="Promo code"
              style={{ padding: "8px 10px", borderRadius: 8 }}
            />
            <button onClick={applyPromo} className="small-btn">Apply</button>
            {promoApplied && <span style={{ color: "#059669", fontWeight: 700 }}>Applied: {promoApplied}</span>}
          </div>

          <div style={{ marginLeft: "auto" }}>
            <input
              type="search"
              placeholder="Search features (e.g., 'API', 'collaboration')"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              aria-label="Search plan features"
              style={{ padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
        </div>
      </section>

      <section className="plans-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginTop: 18 }}>
        {filtered.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthly : plan.yearly;
          const final = computePrice(plan);
          const isSelected = selectedPlan === plan.id;
          return (
            <article key={plan.id} className={`plan-card ${plan.featured ? "featured-plan" : ""}`} style={{
              border: isSelected ? "2px solid #7C3AED" : undefined,
              padding: 18,
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 8px 24px rgba(2,6,23,0.06)"
            }} aria-labelledby={`plan-${plan.id}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="plan-badge" style={{ fontWeight: 800 }}>{plan.badge}</div>
                  <h3 id={`plan-${plan.id}`} style={{ margin: "8px 0" }}>{plan.name}</h3>
                  <div style={{ color: "#374151", fontSize: 14 }}>{plan.short}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>${final}{billingCycle === "yearly" ? "" : ""}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>/ {billingCycle}</div>
                  {billingCycle === "yearly" && <div style={{ color: "#059669", fontWeight: 700, fontSize: 12 }}>You save 20%</div>}
                </div>
              </div>

              <ul style={{ marginTop: 12, paddingLeft: 18 }}>
                {plan.features.length ? plan.features.map((f, i) => (<li key={i} style={{ marginBottom: 8 }}>{f}</li>)) : <li style={{ color: "#6b7280" }}>No matching features for search</li>}
                {plan.disabledFeatures && plan.disabledFeatures.map((f, i) => (<li key={`d-${i}`} style={{ marginTop: 6, color: "#9CA3AF", textDecoration: "line-through" }}> {f} </li>))}
              </ul>

              <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                <button
                  className="plan-btn"
                  onClick={() => handleSubscribeClick(plan.id)}
                  aria-label={`${plan.cta} for ${plan.name}`}
                  style={{
                    flex: 1,
                    background: plan.featured ? "linear-gradient(90deg,#7C3AED,#3B82F6)" : "#111827",
                    color: "#fff",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {plan.cta}
                </button>

                {plan.id === "pro" && (
                  <button
                    onClick={() => { setSelectedPlan("pro"); setShowModal(true); }}
                    className="small-btn"
                    aria-label="Start free trial"
                    style={{ padding: "8px 10px" }}
                  >
                    Start Trial
                  </button>
                )}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ color: "#6b7280", fontSize: 12 }}>{plan.featured ? "Popular" : "Plan"}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Monthly: ${plan.monthly} • Yearly: ${plan.yearly}</div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Comparison table */}
      <section className="plans-comparison" style={{ marginTop: 28 }}>
        <h2 className="comparison-title">Compare Plans Side by Side</h2>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #E6E6E6" }}>
                <th style={{ padding: 12 }}>Features</th>
                {BASE_PLANS.map(p => <th key={p.id} style={{ padding: 12 }}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Unlimited Basic Chats", true, true, true],
                ["Access to Premium AI Models", false, true, true],
                ["Conversation History", false, true, true],
                ["Code & Math Solving", false, true, true],
                ["Team Collaboration", false, false, true],
                ["API Access", false, false, true],
                ["Priority Support", false, true, true],
                ["Export Chats", false, false, true],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: 12 }}>{row[0]}</td>
                  {row.slice(1).map((cell, idx) => (
                    <td key={idx} style={{ padding: 12 }}>{cell ? "✔️" : "❌"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 8 }}>What users say</h3>
        <div aria-roledescription="carousel" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setTestIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Previous testimonial">◀</button>
          <blockquote style={{ padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 8px 24px rgba(2,6,23,0.04)", flex: 1 }}>
            <p style={{ margin: 0, fontStyle: "italic" }}>"{TESTIMONIALS[testIndex].text}"</p>
            <footer style={{ marginTop: 8, fontWeight: 700 }}>{TESTIMONIALS[testIndex].name} — <span style={{ fontWeight: 500, color: "#6b7280" }}>{TESTIMONIALS[testIndex].role}</span></footer>
          </blockquote>
          <button onClick={() => setTestIndex(i => (i + 1) % TESTIMONIALS.length)} aria-label="Next testimonial">▶</button>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 8 }}>Frequently asked questions</h3>
        <div>
          {FAQ.map((f, i) => (
            <div key={i} style={{ marginBottom: 8, borderRadius: 8, overflow: "hidden", border: "1px solid #F3F4F6" }}>
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                aria-expanded={faqOpen === i}
                style={{ width: "100%", textAlign: "left", padding: 12, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontWeight: 700 }}>{f.q}</span>
                <span>{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && <div style={{ padding: 12, background: "#fff", borderTop: "1px solid #F3F4F6" }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise CTA */}
      <section style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h4>Need something bigger?</h4>
          <p style={{ marginTop: 6, color: "#6b7280" }}>Contact our enterprise team for bulk accounts, custom SLAs, and dedicated support.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={contactEnterprise} style={{ padding: "10px 12px", borderRadius: 8, background: "#111827", color: "#fff" }}>Contact Sales</button>
          <button onClick={() => window.open("mailto:enterprise@careerai.example?subject=Enterprise Inquiry","_blank")} className="small-btn">Email</button>
        </div>
      </section>

      {/* Subscribe Modal (mock) */}
      {showModal && (
        <div role="dialog" aria-modal="true" style={{
          position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "rgba(2,6,23,0.6)", zIndex: 1200
        }}>
          <div style={{ width: 520, background: "#fff", borderRadius: 12, padding: 20 }}>
            <h3>Subscribe — {selectedPlan.toUpperCase()}</h3>
            <p style={{ color: "#6b7280" }}>Billing: {billingCycle} • Promo: {promoApplied || "None"}</p>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontWeight: 700 }}>Email</label>
              <input type="email" value={checkoutEmail} onChange={(e) => setCheckoutEmail(e.target.value)} style={{ width: "100%", padding: "8px 10px", marginTop: 6, borderRadius: 8 }} placeholder="you@example.com" />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={confirmCheckout} style={{ padding: "10px 14px", borderRadius: 8, background: "#10B981", color: "#fff", border: "none", cursor: "pointer" }}>Confirm</button>
              <button onClick={() => setShowModal(false)} className="small-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
