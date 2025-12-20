import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";
import "./Admin.css";

/* ================= CONFIG ================= */
const ADMIN_EMAIL = "admin@pathnex.com";
const ADMIN_PASSWORD = "admin123";
const DOMAINS = ["tech", "data", "ai", "cloud", "business"];
const LEVELS = ["easy", "medium", "hard"];
const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"];

/* ================= MAIN ================= */
export default function Admin() {
  const [auth, setAuth] = useState(localStorage.getItem("ADMIN_TOKEN"));
  if (!auth) return <AdminLogin onAuth={setAuth} />;
  return <AdminDashboard onLogout={() => {
    localStorage.removeItem("ADMIN_TOKEN");
    setAuth(null);
  }} />;
}

/* ================= LOGIN ================= */
function AdminLogin({ onAuth }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = () => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      localStorage.setItem("ADMIN_TOKEN", "jwt_mock");
      onAuth("jwt_mock");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <h2>🔐 Admin Portal</h2>
        <p>Enter credentials to access dashboard</p>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button onClick={login}>Secure Login</button>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function AdminDashboard({ onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  /* ---------- LOAD FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("QUIZ_DB")) || [];
    setQuestions(savedQuestions);
    setLogs(JSON.parse(localStorage.getItem("ADMIN_LOGS")) || []);
  }, []);

  /* ---------- SAVE TO LOCALSTORAGE + LOG ---------- */
  const saveDB = (data, action) => {
    setQuestions(data);
    localStorage.setItem("QUIZ_DB", JSON.stringify(data));

    if (action) {
      const entry = {
        action,
        time: new Date().toLocaleString(),
        timestamp: Date.now(),
      };
      const updatedLogs = [entry, ...logs].slice(0, 50);
      setLogs(updatedLogs);
      localStorage.setItem("ADMIN_LOGS", JSON.stringify(updatedLogs));
    }
  };

  /* ---------- CSV IMPORT ---------- */
  const handleCSV = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = reader.result.trim().split("\n").slice(1);
      const parsed = rows.map((r, idx) => {
        const cols = r.split(",");
        if (cols.length < 8) return null;
        const [q, o1, o2, o3, o4, domain, difficulty, weight] = cols;
        return {
          id: Date.now() + idx + Math.random(),
          q: q.trim(),
          options: [o1.trim(), o2.trim(), o3.trim(), o4.trim()],
          answer: o1.trim(),
          domain: domain.trim().toLowerCase(),
          difficulty: difficulty.trim().toLowerCase(),
          weight: Number(weight.trim()),
        };
      }).filter(Boolean);

      saveDB([...questions, ...parsed], `CSV UPLOAD (${parsed.length} questions)`);
      alert(`Successfully imported ${parsed.length} questions!`);
    };
    reader.readAsText(file);
  };

  /* ---------- DELETE ---------- */
  const remove = (id) => {
    if (window.confirm("Permanently delete this question? This action cannot be undone.")) {
      saveDB(questions.filter(q => q.id !== id), "DELETE QUESTION");
    }
  };

  /* ---------- EXPORT TO JSON ---------- */
  const exportToJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quiz-questions-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- ANALYTICS ---------- */
  const totalQuestions = questions.length;
  const domainData = DOMAINS.map(d => ({
    name: d.toUpperCase(),
    value: questions.filter(q => q.domain === d).length,
    percentage: totalQuestions ? Math.round((questions.filter(q => q.domain === d).length / totalQuestions) * 100) : 0
  }));

  const levelData = LEVELS.map(l => ({
    name: l.charAt(0).toUpperCase() + l.slice(1),
    value: questions.filter(q => q.difficulty === l).length
  }));

  /* ---------- FILTERED QUESTIONS ---------- */
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.q.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === "all" || q.domain === filterDomain;
    const matchesDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  return (
    <main className="admin-main">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <h1>Admin Analytics Dashboard</h1>
          <p className="stats-summary">
            Total Questions: <strong>{totalQuestions}</strong> | 
            Domains: <strong>{DOMAINS.length}</strong> | 
            Last Updated: {logs[0]?.time || "Never"}
          </p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={exportToJSON}>📥 Export JSON</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Question</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {/* STATS CARDS */}
      <section className="stats-cards">
        {domainData.map((d, i) => (
          <div key={d.name} className="stat-card" style={{ borderLeftColor: COLORS[i] }}>
            <h4>{d.name}</h4>
            <p className="stat-value">{d.value}</p>
            <p className="stat-percent">{d.percentage}% of total</p>
          </div>
        ))}
      </section>

      {/* CHARTS */}
      <section className="admin-charts">
        <div className="chart-card">
          <h3>Questions by Domain</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} questions`, "Count"]} />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={levelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {levelData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* FILTERS & CSV */}
      <section className="controls-bar">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search questions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)}>
            <option value="all">All Domains</option>
            {DOMAINS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
          </select>
          <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
            <option value="all">All Levels</option>
            {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
        </div>
        <label className="csv-label">
          📄 Import CSV
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => e.target.files[0] && handleCSV(e.target.files[0])}
          />
        </label>
      </section>

      {/* QUESTIONS TABLE */}
      <section className="questions-section">
        <h2>Question Bank ({filteredQuestions.length} displayed)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Domain</th>
              <th>Difficulty</th>
              <th>Weight</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  {questions.length === 0 
                    ? "No questions in database yet. Add or import some to begin."
                    : "No questions match your filters. Try adjusting search or filters."}
                </td>
              </tr>
            ) : (
              filteredQuestions.map((q, idx) => (
                <tr key={q.id}>
                  <td>{idx + 1}</td>
                  <td className="question-text">{q.q}</td>
                  <td><span className={`domain-tag ${q.domain}`}>{q.domain.toUpperCase()}</span></td>
                  <td><span className={`level-tag ${q.difficulty}`}>{q.difficulty}</span></td>
                  <td>{q.weight}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => { setEdit(q); setShowModal(true); }}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => remove(q.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* AUDIT LOGS */}
      <section className="audit-logs">
        <h3>Recent Admin Activity (Last 50 Actions)</h3>
        {logs.length === 0 ? (
          <p className="empty-state">No admin actions recorded yet.</p>
        ) : (
          <div className="logs-list">
            {logs.map((l, i) => (
              <div key={i} className="log-entry">
                <span className="log-action">{l.action}</span>
                <span className="log-time">{l.time}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {showModal && (
        <QuestionModal
          edit={edit}
          onClose={() => {
            setEdit(null);
            setShowModal(false);
          }}
          onSave={(newQuestion) => {
            if (edit) {
              saveDB(
                questions.map(x => x.id === newQuestion.id ? newQuestion : x),
                "EDIT QUESTION"
              );
            } else {
              saveDB([...questions, { ...newQuestion, id: Date.now() + Math.random() }], "ADD QUESTION");
            }
            setEdit(null);
            setShowModal(false);
          }}
        />
      )}
    </main>
  );
}

/* ================= QUESTION MODAL ================= */
function QuestionModal({ edit, onClose, onSave }) {
  const [form, setForm] = useState(
    edit || {
      q: "",
      options: ["", "", "", ""],
      answer: "",
      domain: "tech",
      difficulty: "easy",
      weight: 1,
    }
  );

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSave = () => {
    if (!form.q.trim()) {
      alert("Question text is required.");
      return;
    }
    if (form.options.some(o => !o.trim())) {
      alert("All 4 options must be filled.");
      return;
    }
    if (!form.answer) {
      alert("Please select the correct answer.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>{edit ? "Edit Question" : "Add New Question"}</h3>

        <textarea
          placeholder="Question text (be clear and concise)"
          value={form.q}
          onChange={e => setForm({ ...form, q: e.target.value })}
          rows="3"
        />

        <div className="options-section">
          <h4>Options (select correct answer)</h4>
          {form.options.map((opt, i) => (
            <div key={i} className="option-row">
              <span className="option-index">{String.fromCharCode(65 + i)}</span>
              <input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => handleOptionChange(i, e.target.value)}
              />
              <label className="radio-label">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={form.answer === opt}
                  onChange={() => setForm({ ...form, answer: opt })}
                />
                Correct
              </label>
            </div>
          ))}
        </div>

        <div className="meta-fields">
          <select
            value={form.domain}
            onChange={e => setForm({ ...form, domain: e.target.value })}
          >
            {DOMAINS.map(d => (
              <option key={d} value={d}>{d.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={form.difficulty}
            onChange={e => setForm({ ...form, difficulty: e.target.value })}
          >
            {LEVELS.map(l => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Weight"
            value={form.weight}
            onChange={e => setForm({ ...form, weight: Number(e.target.value) })}
          />
        </div>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>
            {edit ? "Update Question" : "Add Question"}
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}