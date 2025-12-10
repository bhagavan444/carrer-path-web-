import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  PieChart, Pie, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import "./Predict.css";

const domainSuggestions = [
  "AI", "Python", "Java", "Cybersecurity", "Full Stack", "UI/UX", "Data Science"
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function Predict() {
  const [resumeFile, setResumeFile] = useState(null);
  const [domainChoice, setDomainChoice] = useState("");
  const [userInterest, setUserInterest] = useState("");
  const [aiSuggested, setAiSuggested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { width, height } = useWindowSize();
  const [compactView, setCompactView] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [skillBadges, setSkillBadges] = useState([]);
  const reportRef = useRef();

  // Load saved report and profiles from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("careerReport");
    if (saved) setResult(JSON.parse(saved));
    const savedProfiles = JSON.parse(localStorage.getItem("careerProfiles") || "[]");
    setProfiles(savedProfiles);
    // keyboard shortcut: Ctrl+Enter to submit
    const onKey = (e) => {
      if (e.ctrlKey && e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (result) localStorage.setItem("careerReport", JSON.stringify(result));
  }, [result]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setResumeFile(e.dataTransfer.files[0]);
  };

  // MAIN SUBMIT - calls your /predict endpoint (existing)
  const handleSubmit = async () => {
    if (!resumeFile) {
      alert("📄 Please upload your resume.");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("preferredDomain", domainChoice);
    formData.append("useAI", aiSuggested);
    formData.append("interests", userInterest);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Massage response into safe shape if needed
      const data = {
        ...res.data,
        aspectScores: res.data.aspectScores || [
          { name: "Formatting", value: 75 },
          { name: "Keywords", value: 60 },
          { name: "Experience", value: 70 },
        ],
        education: res.data.summary && res.data.summary.education ? parseEducation(res.data.summary.education) : [],
        experience: res.data.summary && res.data.summary.experience ? parseExperience(res.data.summary.experience) : [],
        domainFits: (res.data.roles || []).map((r, i) => ({ domain: r, fit: Math.round(60 + i * 5) })),
        growthProjection: res.data.growthProjection || generateGrowthSample(),
        improvements: res.data.improvements || generateGenericImprovements(res.data.skills || []),
        roadmap: res.data.roadmap || ["Polish skills", "Build portfolio project", "Apply to targeted roles"],
      };
      setResult(data);
    } catch (err) {
      alert(`❌ Failed to analyze resume: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Export PDF (same as before) with slight improvement for multi-page
  const handleDownloadPDF = async () => {
    const reportEl = reportRef.current || document.querySelector(".result-section");
    if (!reportEl) return;
    const canvas = await html2canvas(reportEl, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    // if longer than a page, split
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("career_report.pdf");
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "career_report.json";
    link.click();
  };

  const handleEmailReport = () => {
    const subject = encodeURIComponent("Career Report");
    const body = encodeURIComponent("Please find my career report attached.\n\n(Attach exported PDF or share link)");
    window.location.href = `mailto:g.sivasatyasaibhagavan@gmail.com?subject=${subject}&body=${body}`;
  };

  const exportBadge = async () => {
    const badge = document.querySelector(".resume-score-badge");
    if (!badge) return;
    const canvas = await html2canvas(badge);
    const link = document.createElement("a");
    link.download = "resume_score.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // NEW: Generate shareable blob URL for report
  const createShareableLink = () => {
    if (!result) return alert("Generate a report first.");
    const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setShareUrl(url);
    prompt("Shareable URL (temporary): copy this and share", url);
  };

  // NEW: Save report to named profile
  const saveProfile = (name) => {
    if (!result) return alert("Generate a report first.");
    const saved = JSON.parse(localStorage.getItem("careerProfiles") || "[]");
    const p = { id: Date.now(), name: name || `Profile ${saved.length + 1}`, created: new Date().toISOString(), report: result };
    saved.push(p);
    localStorage.setItem("careerProfiles", JSON.stringify(saved));
    setProfiles(saved);
    setProfileName("");
    alert("Profile saved locally.");
  };
  const loadProfile = (id) => {
    const saved = JSON.parse(localStorage.getItem("careerProfiles") || "[]");
    const p = saved.find((s) => s.id === id);
    if (p) setResult(p.report);
  };

  // NEW: Speech summary
  const speakSummary = () => {
    if (!result) return;
    const s = new SpeechSynthesisUtterance();
    s.text = `Your resume score is ${result.score || "not available"} percent. Recommended roles: ${ (result.roles || []).slice(0,3).join(", ") }. Key skills: ${(result.skills || []).slice(0,5).join(", ")}.`;
    s.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(s);
  };

  // NEW: Generate vCard
  const generateVCard = () => {
    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:G S S S Bhagavan`,
      `EMAIL;TYPE=WORK:g.sivasatyasaibhagavan@gmail.com`,
      `TEL;TYPE=CELL:+917569205626`,
      `ORG:Ramachandra College of Engineering`,
      `TITLE:B.Tech (AI & Data Science)`,
      `END:VCARD`
    ].join("\n");
    const blob = new Blob([vcf], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "GSSSBhagavan.vcf";
    a.click();
  };

  // NEW: Schedule mock interview (calendar link)
  const scheduleMockInterview = () => {
    const title = encodeURIComponent("Mock Interview - Career Path AI");
    const details = encodeURIComponent("Mock interview scheduled via Career Path AI platform.");
    const start = new Date();
    start.setDate(start.getDate() + 2); // default 2 days later
    const end = new Date(start.getTime() + 30 * 60000);
    const fmt = (d) => d.toISOString().replace(/-|:|\.\d+/g, "");
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}&dates=${fmt(start)}/${fmt(end)}`;
    window.open(url, "_blank");
  };

  // NEW: Copy summary to clipboard
  const copySummary = async () => {
    if (!result) return;
    const text = `Resume Score: ${result.score}\nSuggested Roles: ${(result.roles || []).join(", ")}\nTop Skills: ${(result.skills || []).slice(0,5).join(", ")}`;
    await navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard.");
  };

  // NEW: Toggle badge skill pin
  const toggleSkillBadge = (skill) => {
    setSkillBadges((prev) => {
      if (prev.includes(skill)) return prev.filter((s) => s !== skill);
      return [...prev, skill];
    });
  };

  // NEW: Generate a cover letter (calls server endpoint if available)
  const generateCoverLetter = async () => {
    if (!result) return alert("Generate a report first.");
    try {
      setLoading(true);
      // try server-side endpoint if available
      const res = await axios.post("http://localhost:5000/api/cover-letter", { roles: result.roles, summary: result.summary });
      if (res.data && res.data.letter) {
        downloadTextFile(res.data.letter, "cover_letter.txt");
      } else {
        // fallback client-side template
        const letter = coverLetterTemplate(result.roles?.[0] || "Role", result.summary || {});
        downloadTextFile(letter, "cover_letter.txt");
      }
    } catch (e) {
      // fallback client-side template
      const letter = coverLetterTemplate(result.roles?.[0] || "Role", result.summary || {});
      downloadTextFile(letter, "cover_letter.txt");
    } finally {
      setLoading(false);
    }
  };

  const downloadTextFile = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  // NEW: Inline-edit improvements
  const updateImprovement = (idx, val) => {
    setResult((r) => {
      const next = { ...r };
      next.improvements = next.improvements ? [...next.improvements] : [];
      next.improvements[idx] = val;
      return next;
    });
  };

  // NEW: Share via navigator.share
  const nativeShare = async () => {
    if (!result) return alert("Generate report first.");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Career Report",
          text: `Resume Score: ${result.score}\nRoles: ${(result.roles || []).join(", ")}`,
        });
      } catch (e) {
        alert("Share canceled.");
      }
    } else {
      createShareableLink();
    }
  };

  // Utilities & small fake data generators (client-only)
  function parseEducation(str) {
    // naive parse: split by lines and map
    return (str || "").split("\n").filter(Boolean).map((line, i) => ({ degree: line.trim(), institution: "—", year: "—" }));
  }
  function parseExperience(str) {
    return (str || "").split("\n").filter(Boolean).map((line, i) => ({ role: line.trim(), company: "—", years: "—" }));
  }
  function generateGrowthSample() {
    const now = new Date().getFullYear();
    return [
      { year: now, salary: 300000 },
      { year: now + 1, salary: 420000 },
      { year: now + 2, salary: 520000 },
      { year: now + 3, salary: 640000 }
    ];
  }
  function generateGenericImprovements(skills) {
    if (!skills || skills.length === 0) return ["Add measurable results to projects", "Highlight technologies used", "Increase keyword density for target roles"];
    return skills.slice(0,5).map(s => `Demonstrate project using ${s} (link/github)`);
  }
  function coverLetterTemplate(role, summary) {
    return `Dear Hiring Manager,

I am writing to express my interest in the ${role} role. My resume demonstrates experience in ${ (summary && summary.projects) ? summary.projects : "relevant projects and skills" }.

I am confident I can contribute to your team by delivering measurable impact, and I would welcome the opportunity to discuss this role further.

Sincerely,
G S S S Bhagavan
`;
  }

  // vDOM
  return (
    <div className={`predict-container ${darkMode ? "dark" : ""}`} role="main" aria-label="Career Path Recommender">
      <div className="floating-badge" aria-hidden="true">✨ Career Wizard AI</div>

      <button
        className="dark-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {result && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

      <header className="predict-header" role="banner">
        <h1 className="predict-title">🚀 Smart Career Path Recommender</h1>
        <p className="predict-subtitle">Unlock your potential with AI-driven career insights</p>
      </header>

      <section className="predict-form" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} role="form" aria-labelledby="form-title">
        <h2 id="form-title" className="form-title">Get Started with Your Career Analysis</h2>

        <div className="form-row">
          <label className="form-label">📎 Upload Resume</label>
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
          {resumeFile && <div className="file-preview">✅ {resumeFile.name}</div>}
        </div>

        <div className="form-row">
          <label className="form-label">💼 Preferred Domain</label>
          <input list="domainList" value={domainChoice} onChange={(e) => setDomainChoice(e.target.value)} placeholder="e.g., AI, Python" />
          <datalist id="domainList">{domainSuggestions.map(d => <option key={d} value={d} />)}</datalist>
        </div>

        <div className="form-row">
          <label className="form-label">💡 Interests</label>
          <input value={userInterest} onChange={(e) => setUserInterest(e.target.value)} placeholder="robotics, fintech, gaming..." />
        </div>

        <div className="form-row checkbox-row">
          <input id="ai-toggle" type="checkbox" checked={aiSuggested} onChange={() => setAiSuggested(!aiSuggested)} />
          <label htmlFor="ai-toggle">🔮 Let AI suggest best-fit career paths</label>
        </div>

        <div className="form-actions">
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Analyzing..." : "Generate Career Suggestions"}
          </button>

          <button className="secondary-btn" onClick={() => { setResult(null); setResumeFile(null); }}>
            Reset
          </button>

          <button className="secondary-btn" onClick={() => setCompactView(!compactView)}>
            {compactView ? "Detailed View" : "Compact View"}
          </button>
        </div>

        <div className="form-hint">Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit quickly.</div>
      </section>

      {/* RESULTS */}
      {result && (
        <section className="result-section" role="region" aria-labelledby="results-title" ref={reportRef}>
          <h2 id="results-title">✅ Your Career Analysis Report</h2>

          {/* top actions */}
          <div className="top-actions">
            <button onClick={handleDownloadPDF} className="action">📥 Download PDF</button>
            <button onClick={handleDownloadJSON} className="action">📝 Export JSON</button>
            <button onClick={nativeShare} className="action">🔗 Share</button>
            <button onClick={speakSummary} className="action">🔊 Read Summary</button>
            <button onClick={generateVCard} className="action">📇 vCard</button>
            <button onClick={scheduleMockInterview} className="action">🗓️ Schedule Mock Interview</button>
            <button onClick={() => saveProfile(prompt("Profile name", `Profile ${Date.now()}`) || "Saved profile")} className="action">💾 Save Profile</button>
            <button onClick={createShareableLink} className="action">🌐 Create Share Link</button>
          </div>

          <div className={`result-grid ${compactView ? "compact" : ""}`}>
            <div className="result-card resume-score-badge">
              <h3>📈 Resume Score</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Score", value: result.score ?? 0 },
                      { name: "Remaining", value: 100 - (result.score ?? 0) },
                    ]}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    labelLine={false}
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill="#eee" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="score-row">
                <div className="score-big">{result.score ?? "N/A"} / 100</div>
                <div className="score-cta">
                  <button className="small-btn" onClick={exportBadge}>🏅 Export Badge</button>
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3>🎯 Suggested Roles</h3>
              <p className="roles-list">{(result.roles && result.roles.length) ? result.roles.join(", ") : "No roles identified."}</p>
              <div className="role-actions">
                <button className="small-btn" onClick={generateCoverLetter}>✉️ Generate Cover Letter</button>
                <button className="small-btn" onClick={copySummary}>📋 Copy Summary</button>
              </div>
            </div>

            <div className="result-card">
              <h3>🧠 Key Skills</h3>
              {result.skills && result.skills.length ? (
                <>
                  <div className="skill-badges">
                    {result.skills.map((s, i) => (
                      <button
                        key={s}
                        className={`skill-badge ${skillBadges.includes(s) ? "pinned" : ""}`}
                        onClick={() => toggleSkillBadge(s)}
                        title={skillBadges.includes(s) ? "Unpin skill" : "Pin skill"}
                        aria-pressed={skillBadges.includes(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={result.skills.map((skill, idx) => ({ subject: skill, A: 60 + (idx * 6) % 40, fullMark: 100 }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </>
              ) : <p>No skills found.</p>}
            </div>

            <div className="result-card">
              <h3>📊 Resume Aspect Scores</h3>
              {result.aspectScores && result.aspectScores.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={result.aspectScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p>Not available.</p>}
            </div>

            {/* wide cards */}
            {result.education && result.education.length > 0 && (
              <div className="result-card wide-card">
                <h3>🎓 Education</h3>
                <div className="timeline">
                  {result.education.map((edu, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-circle">{idx + 1}</div>
                      <div>
                        <strong>{edu.degree}</strong>
                        <div className="muted">{edu.institution} • {edu.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.experience && result.experience.length > 0 && (
              <div className="result-card wide-card">
                <h3>💼 Experience</h3>
                <div className="timeline">
                  {result.experience.map((exp, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-circle">{idx + 1}</div>
                      <div>
                        <strong>{exp.role}</strong>
                        <div className="muted">{exp.company} • {exp.years}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="result-card">
              <h3>🌐 Domain Fit</h3>
              {result.domainFits && result.domainFits.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={result.domainFits.map(df => ({ subject: df.domain, A: df.fit }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0,100]} />
                    <Radar dataKey="A" stroke="#00C49F" fill="#00C49F" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : <p>Not available.</p>}
            </div>

            <div className="result-card wide-card">
              <h3>📈 Growth Projection</h3>
              {result.growthProjection && result.growthProjection.length ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={result.growthProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="salary" stroke="#FF8042" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p>Not available.</p>}
            </div>

            <div className="result-card">
              <h3>🛠️ Improvements</h3>
              <ul className="improvement-list">
                {(result.improvements || []).map((imp, idx) => (
                  <li key={idx}>
                    <input
                      className="improvement-input"
                      value={imp}
                      onChange={(e) => updateImprovement(idx, e.target.value)}
                      aria-label={`Edit improvement ${idx+1}`}
                    />
                  </li>
                ))}
              </ul>
              <div className="improvement-actions">
                <button className="small-btn" onClick={() => { setResult(r => ({...r, improvements: [...(r.improvements||[]), "Add a quantified metric (e.g., reduced load time by 20%)"]})); }}>+ Suggest Improvement</button>
              </div>
            </div>

            {result.roadmap && result.roadmap.length > 0 && (
              <div className="result-card wide-card roadmap-visual">
                <h3>🛤️ Career Roadmap</h3>
                <div className="roadmap-track">
                  {result.roadmap.map((step, idx) => (
                    <div key={idx} className="roadmap-step">
                      <div className="roadmap-circle">{idx + 1}</div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* bottom actions */}
          <div className="report-actions">
            <button onClick={handleDownloadPDF} className="download-btn">📥 Download PDF</button>
            <button onClick={handleDownloadJSON} className="download-btn">📝 Export JSON</button>
            <button onClick={handleEmailReport} className="email-btn">📧 Email Report</button>
            <button onClick={nativeShare} className="share-btn">🔗 Share</button>
            <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(result)); alert("Full report copied to clipboard."); }} className="copy-btn">📋 Copy Report</button>
          </div>

          {/* profiles list */}
          {!!profiles.length && (
            <div className="saved-profiles">
              <h4>Saved Profiles</h4>
              <div className="profiles-list">
                {profiles.map(p => (
                  <div key={p.id} className="profile-item">
                    <div><strong>{p.name}</strong> <span className="muted">({new Date(p.created).toLocaleString()})</span></div>
                    <div className="profile-actions">
                      <button onClick={() => loadProfile(p.id)} className="tiny-btn">Load</button>
                      <button onClick={() => { const remaining = profiles.filter(x => x.id !== p.id); localStorage.setItem("careerProfiles", JSON.stringify(remaining)); setProfiles(remaining); }} className="tiny-btn danger">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* ephemeral share url shown */}
      {shareUrl && (
        <div className="share-link">
          <input type="text" value={shareUrl} readOnly />
          <button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy Link</button>
        </div>
      )}
    </div>
  );
}
