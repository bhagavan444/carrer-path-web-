import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import "./Predict.css";

/* ===============================
   CONFIG
================================ */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COLORS = ["#2563eb", "#10b981", "#f59e0b"];

/* ===============================
   COMPONENT
================================ */
export default function Predict() {
  const [resumeFile, setResumeFile] = useState(null);
  const [domainChoice, setDomainChoice] = useState("");
  const [userInterest, setUserInterest] = useState("");
  const [aiSuggested, setAiSuggested] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);

  const reportRef = useRef(null);
  const { width, height } = useWindowSize();

  /* ===============================
     FILE
  ================================ */
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setResult(null);
  };

  /* ===============================
     API CALL
  ================================ */
  const handleSubmit = async () => {
    if (!resumeFile) {
      alert("Please upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("preferredDomain", domainChoice);
    formData.append("interests", userInterest);
    formData.append("useAI", aiSuggested);

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/predict`, formData);

      /* Backend already sends final JSON */
      setResult(res.data);
      localStorage.setItem("careerReport", JSON.stringify(res.data));
    } catch (err) {
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     EXPORT
  ================================ */
  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 10, w, h);
    pdf.save("career_report.pdf");
  };

  const createShareLink = () => {
    const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setShareUrl(url);
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="predict-container">
      {result && <Confetti width={width} height={height} recycle={false} />}

      <header className="predict-header">
        <h1>AI Resume Analyzer</h1>
        <p>Industry-grade career intelligence report</p>
      </header>

      {/* FORM */}
      <section className="predict-form">
        <input type="file" accept=".pdf" onChange={handleFileChange} />

        <input
          placeholder="Preferred Domain"
          value={domainChoice}
          onChange={(e) => setDomainChoice(e.target.value)}
        />

        <input
          placeholder="Interests"
          value={userInterest}
          onChange={(e) => setUserInterest(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={aiSuggested}
            onChange={() => setAiSuggested(!aiSuggested)}
          />
          Let AI recommend roles
        </label>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Generate Report"}
        </button>
      </section>

      {/* REPORT */}
      {result && (
        <section className="result-section" ref={reportRef}>
          <h2>Career Analysis Report</h2>

          {/* SCORE */}
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={[
                  { name: "Score", value: result.score },
                  { name: "Remaining", value: 100 - result.score }
                ]}
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* ASPECT SCORES */}
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={result.aspectScores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar dataKey="value" fill="#2563eb" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>

          {/* ROLES */}
          <h3>Recommended Roles</h3>
          <ul>
            {result.roles.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          {/* SKILLS */}
          <h3>Key Skills Identified</h3>
          <div className="skill-tags">
            {result.skills.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>

          {/* SUMMARY */}
          <h3>Profile Summary</h3>
          <p><strong>Education:</strong> {result.summary.education}</p>
          <p><strong>Experience:</strong> {result.summary.experience}</p>

          {/* ROADMAP */}
          <h3>Career Roadmap</h3>
          <ol>
            {result.roadmap.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {/* IMPROVEMENTS */}
          <h3>Resume Improvements</h3>
          <ul>
            {result.improvements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ul>

          {/* GROWTH */}
          <h3>Career Growth Projection</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={result.growthProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="salary" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>

          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={createShareLink}>Create Share Link</button>
        </section>
      )}

      {shareUrl && (
        <div className="share-link">
          <input value={shareUrl} readOnly />
          <button onClick={() => navigator.clipboard.writeText(shareUrl)}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
