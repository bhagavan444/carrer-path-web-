import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plus,
  Trash2,
  Send,
  Sun,
  Moon,
  Copy,
  Paperclip,
  RefreshCcw,
  Search,
  Book,
  Edit2,
  Download,
  Pin,
  Star,
  Tag,
  FileText,
  File,
  Heart,
  ThumbsUp,
  Quote,
} from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import EmojiPicker from "emoji-picker-react";
import html2pdf from "html2pdf.js";
import "./Chat.css";

const API_BASE = "http://localhost:5000/api";

/* ══════════════════════════════════════════════════════════
   INJECTED GLOBAL STYLES
   Ports the Home.jsx design system into the chat context:
   – Same fonts (Cormorant Garamond · Instrument Sans · JetBrains Mono)
   – Same keyframes (fadeUp · fadeIn · navIn · ripple · float · orb1/2 …)
   – cursor:none on the entire chat root
   – Home.jsx CSS variables bridged onto Chat.css token names
══════════════════════════════════════════════════════════ */
const CHAT_GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* ── cursor:none on chat root only ── */
  .chat-root, .chat-root * { cursor: none !important; }

  /* ── bridge Home.jsx tokens → Chat.css vars (dark) ── */
  .chat-root.theme-dark {
    --font-display: 'Cormorant Garamond', serif;
    --font-ui:      'Instrument Sans', sans-serif;
    --font-mono:    'JetBrains Mono', monospace;
    --accent:       #1a55e6;
    --accent-dim:   rgba(26,85,230,0.1);
    --accent-glow:  rgba(26,85,230,0.18);
    --accent-hover: #1244c2;
    --green:        #06956a;
  }

  /* ── bridge tokens (light) ── */
  .chat-root.theme-light {
    --font-display: 'Cormorant Garamond', serif;
    --font-ui:      'Instrument Sans', sans-serif;
    --font-mono:    'JetBrains Mono', monospace;
    --accent:       #1a55e6;
    --accent-dim:   rgba(26,85,230,0.08);
    --accent-glow:  rgba(26,85,230,0.15);
    --accent-hover: #1244c2;
    --green:        #06956a;
  }

  /* ── keyframes (exact Home.jsx set) ── */
  @keyframes ch-fadeUp   { from{opacity:0;transform:translateY(44px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ch-fadeDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ch-fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes ch-scaleIn  { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes ch-navIn    { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ch-slideL   { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes ch-ripple   { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.6);opacity:0} }
  @keyframes ch-float    { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-12px) rotate(.4deg)} 70%{transform:translateY(-6px) rotate(-.3deg)} }
  @keyframes ch-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ch-gradSlide{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes ch-shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes ch-spin     { to{transform:rotate(360deg)} }
  @keyframes ch-orb1     { 0%,100%{transform:translate(0,0)} 33%{transform:translate(40px,-30px)} 66%{transform:translate(-20px,20px)} }
  @keyframes ch-orb2     { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-50px,25px)} 66%{transform:translate(30px,-15px)} }
  @keyframes ch-msgIn    { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ch-toastIn  { from{opacity:0;transform:translateX(24px) scale(.93)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes ch-barPulse { 0%,100%{height:4px;opacity:.35} 50%{height:18px;opacity:1} }

  /* ── topbar: animated entry ── */
  .ch-topbar-in { animation: ch-navIn .5s cubic-bezier(.4,0,.2,1) both; }

  /* ── sidebar items: stagger slide-in ── */
  .ch-item-in { animation: ch-slideL .22s cubic-bezier(.4,0,.2,1) both; }

  /* ── message rows ── */
  .ch-msg-in { animation: ch-msgIn .3s cubic-bezier(.4,0,.2,1) both; }

  /* ── input area ── */
  .ch-input-in { animation: ch-fadeUp .4s .25s cubic-bezier(.4,0,.2,1) both; }

  /* ── fab entrance ── */
  .ch-fab-in  { animation: ch-scaleIn .35s cubic-bezier(.34,1.56,.64,1) both; }

  /* ── brand italic (Cormorant) ── */
  .ch-brand {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -.01em;
  }

  /* ── live status pill ── */
  .ch-live-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border-radius: 20px;
    border: 1px solid rgba(6,149,106,.24);
    background: rgba(6,149,106,.07);
  }
  .ch-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green, #06956a);
    position: relative;
  }
  .ch-live-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1.5px solid var(--green, #06956a);
    animation: ch-ripple 2s ease-out infinite;
  }
  .ch-live-label {
    font-size: 10px;
    color: var(--green, #06956a);
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: .1em;
  }

  /* ── ambient orbs ── */
  .ch-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
  }
  .ch-orb-1 {
    top: -12%; left: -6%;
    width: 44vw; height: 44vw;
    background: radial-gradient(circle, rgba(26,85,230,.06) 0%, transparent 65%);
    animation: ch-orb1 14s ease-in-out infinite;
  }
  .ch-orb-2 {
    bottom: -10%; right: 2%;
    width: 38vw; height: 38vw;
    background: radial-gradient(circle, rgba(6,149,106,.04) 0%, transparent 65%);
    animation: ch-orb2 18s ease-in-out infinite;
  }

  /* ── noise texture ── */
  .ch-noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.022'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 300px;
  }

  /* ── data-mag: cursor-follows element ── */
  [data-mag] { transition: transform .22s cubic-bezier(.4,0,.2,1); }

  /* ── motion: send button loading spinner ── */
  .ch-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ch-spin .7s linear infinite;
  }
`;

function useInjectChatGlobal() {
  useEffect(() => {
    const id = "chat-global-v1";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = CHAT_GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC CURSOR  — exact port from Home.jsx
══════════════════════════════════════════════════════════ */
function MagneticCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const pos     = useRef({ x: -200, y: -200 });
  const cur     = useRef({ x: -200, y: -200 });
  const rafId   = useRef(null);
  const [label,   setLabel  ] = useState("");
  const [big,     setBig    ] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hidden,  setHidden ] = useState(false);

  useEffect(() => {
    const ring = ringRef.current;
    const dot  = dotRef.current;
    let bigState = false;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 5}px)`;

      const el  = document.elementFromPoint(e.clientX, e.clientY);
      const mag = el?.closest("[data-mag]");
      document.querySelectorAll("[data-mag]").forEach(m => {
        if (m !== mag) m.style.transform = "";
      });
      if (mag) {
        const r  = mag.getBoundingClientRect();
        const ox = (e.clientX - (r.left + r.width  / 2)) * 0.38;
        const oy = (e.clientY - (r.top  + r.height / 2)) * 0.38;
        mag.style.transform = `translate(${ox}px,${oy}px)`;
        setLabel(mag.dataset.magLabel || "");
        bigState = true; setBig(true);
      } else {
        setLabel("");
        const isBtn = el?.closest("button,a,input,textarea,select,[data-clickable]");
        bigState = !!isBtn; setBig(!!isBtn);
      }
    };

    const onDown  = () => setPressed(true);
    const onUp    = () => setPressed(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const tick = () => {
      const ease = bigState ? 0.11 : 0.19;
      cur.current.x += (pos.current.x - cur.current.x) * ease;
      cur.current.y += (pos.current.y - cur.current.y) * ease;
      const size = bigState ? 54 : 40;
      ring.style.transform = `translate(${cur.current.x - size/2}px,${cur.current.y - size/2}px)`;
      ring.style.width  = `${size}px`;
      ring.style.height = `${size}px`;
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 99999,
        borderRadius: "50%",
        border: `1.5px solid ${pressed ? "var(--accent)" : big ? "var(--accent)" : "rgba(255,255,255,0.55)"}`,
        background: pressed ? "rgba(26,85,230,0.06)" : big ? "rgba(26,85,230,0.04)" : "transparent",
        opacity: hidden ? 0 : 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color .2s, background .2s, opacity .3s",
        mixBlendMode: "normal",
        backdropFilter: big ? "blur(3px)" : "none",
      }}>
        {label && (
          <span style={{
            fontSize: 9, fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontWeight: 700, color: "var(--accent, #1a55e6)",
            letterSpacing: ".1em", whiteSpace: "nowrap",
            animation: "ch-fadeIn .15s ease",
          }}>{label}</span>
        )}
      </div>
      {/* Inner dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0,
        width: 10, height: 10, borderRadius: "50%",
        background: pressed ? "var(--accent, #1a55e6)" : "rgba(255,255,255,0.9)",
        pointerEvents: "none", zIndex: 100000,
        opacity: hidden ? 0 : 1,
        transition: "background .15s, opacity .3s, transform .04s linear",
      }} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   ALL ORIGINAL UTILITY FUNCTIONS — ZERO CHANGES
══════════════════════════════════════════════════════════ */
function parseInlineFormatting(text = "") {
  let s = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^# (.*?)$/gm, '<h1 class="markdown-header">$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2 class="markdown-subheader">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="markdown-subheader">$1</h3>')
    .replace(/^- (.*?)$/gm, '<li class="markdown-list">$1</li>')
    .replace(/^\* (.*?)$/gm, '<li class="markdown-list">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="markdown-ordered-list">$1</li>')
    .replace(/^\> (.*?)$/gm, '<blockquote class="markdown-blockquote">$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link">$1</a>')
    .replace(/^\|(.+?)\|$/gm, (match, content) => {
      const rows = content.split("\n").map(row => row.trim()).filter(row => row);
      const headers = rows[0].split("|").map(h => h.trim()).filter(h => h);
      const alignments = rows[1]?.split("|").map(cell => {
        cell = cell.trim();
        if (cell.startsWith(":") && cell.endsWith(":")) return "center";
        if (cell.startsWith(":")) return "left";
        if (cell.endsWith(":")) return "right";
        return "";
      }).filter(a => a !== undefined) || [];
      const bodyRows = rows.slice(2).map(row => row.split("|").map(cell => cell.trim()).filter(cell => cell));
      let tableHTML = '<table class="markdown-table">';
      tableHTML += '<thead><tr>';
      headers.forEach((header, i) => {
        tableHTML += `<th${alignments[i] ? ` style="text-align: ${alignments[i]}"` : ''}>${header}</th>`;
      });
      tableHTML += '</tr></thead>';
      tableHTML += '<tbody>';
      bodyRows.forEach(row => {
        tableHTML += '<tr>';
        row.forEach((cell, i) => {
          tableHTML += `<td${alignments[i] ? ` style="text-align: ${alignments[i]}"` : ''}>${cell}</td>`;
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';
      return tableHTML;
    })
    .replace(/(<li class="markdown-list">.*?(?:<\/li>\n?)+)/gs, '<ul class="markdown-ul">$1</ul>')
    .replace(/(<li class="markdown-ordered-list">.*?(?:<\/li>\n?)+)/gs, '<ol class="markdown-ol">$1</ol>');
  s = s.replace(/(<blockquote class="markdown-blockquote">.*?(?:<\/blockquote>\n?)+)/gs, '<div class="markdown-blockquote-group">$1</div>');
  return `<div class="markdown-content">${s}</div>`;
}

function renderMessageContent(raw = "", isCodeEditable = false, onCodeEdit) {
  if (!raw && raw !== "") return null;
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = codeBlockRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const textPart = raw.slice(lastIndex, match.index);
      parts.push(
        <div className="message-text markdown-section" key={`txt-${i++}`}
          dangerouslySetInnerHTML={{ __html: parseInlineFormatting(textPart) }} />
      );
    }
    const lang = match[1] || "text";
    const code = match[2];
    parts.push(
      <div className="code-block" key={`cb-${i++}`}>
        {isCodeEditable ? (
          <textarea className="code-editor" defaultValue={code}
            onChange={(e) => onCodeEdit && onCodeEdit(e.target.value)} />
        ) : (
          <SyntaxHighlighter language={lang} style={atomOneDark}
            customStyle={{ background:"transparent", padding:"0.75rem", borderRadius:"0.6rem", margin:0, fontSize:"0.95rem" }}>
            {code}
          </SyntaxHighlighter>
        )}
        <button className="code-copy-btn" onClick={() => navigator.clipboard.writeText(code)}
          title="Copy code" aria-label="Copy code">
          <Copy size={14} />
        </button>
      </div>
    );
    lastIndex = codeBlockRegex.lastIndex;
  }
  if (lastIndex < raw.length) {
    const tail = raw.slice(lastIndex);
    parts.push(
      <div className="message-text markdown-section" key={`txt-end-${i++}`}
        dangerouslySetInnerHTML={{ __html: parseInlineFormatting(tail) }} />
    );
  }
  return parts;
}

function TypingDots() {
  return (
    <div className="typing-indicator" aria-hidden="true">
      <span className="typing-bar" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="skeleton-message">
      <div className="skeleton-avatar" />
      <div className="skeleton-content">
        <div className="skeleton-line" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );
}

function getMessageType(reply) {
  try {
    const json = JSON.parse(reply);
    if (json.type === "ats") return "ATS Report";
    if (json.type === "ppt" || json.type === "pdf") return "Document";
    if (json.code) return "Code";
  } catch {
    return reply.includes("```") ? "Code" : "Answer";
  }
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   All state, all effects, all handlers: exactly as supplied.
   UI layer gets: MagneticCursor · data-mag attrs · ambient orbs
   · noise layer · animated topbar/sidebar/messages/input/fabs/toasts
══════════════════════════════════════════════════════════ */
export default function ChatUI() {
  useInjectChatGlobal();

  /* ── ALL ORIGINAL STATE ── */
  const [sessions, setSessions] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(16);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionTitle, setEditingSessionTitle] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactions, setReactions] = useState({});
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [tags, setTags] = useState({});
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chatAreaWidth, setChatAreaWidth] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [messageStatus, setMessageStatus] = useState({});

  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);
  const searchInputRef = useRef(null);
  const chatMainRef = useRef(null);
  const dragRef = useRef(null);

  /* ══ ALL ORIGINAL useEffects — ZERO CHANGES ══ */
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.classList.toggle("theme-light", theme === "light");
    document.documentElement.style.setProperty("--font-size", `${fontSize}px`);
  }, [theme, fontSize]);

  useEffect(() => {
    fetchChats();
    const savedState = localStorage.getItem("chatState");
    if (savedState) {
      const { sessions, chatId, messages } = JSON.parse(savedState);
      setSessions(sessions);
      setChatId(chatId);
      setMessages(messages);
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768);
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setSidebarCollapsed(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const el = chatBodyRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(160, ta.scrollHeight)}px`;
  }, [input]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && !showEmojiPicker) {
        handleSend(e);
      } else if (e.key === "Escape") {
        setEditingMessageId(null);
        setShowEmojiPicker(false);
      } else if (e.key === "ArrowUp" && sidebarOpen) {
        const currentIdx = sessions.findIndex((s) => s._id === chatId);
        if (currentIdx > 0) selectChat(sessions[currentIdx - 1]._id);
      } else if (e.key === "ArrowDown" && sidebarOpen) {
        const currentIdx = sessions.findIndex((s) => s._id === chatId);
        if (currentIdx < sessions.length - 1) selectChat(sessions[currentIdx + 1]._id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sessions, chatId, showEmojiPicker]);

  useEffect(() => {
    localStorage.setItem("chatState", JSON.stringify({ sessions, chatId, messages }));
  }, [sessions, chatId, messages]);

  /* ══ ALL ORIGINAL HANDLERS — ZERO CHANGES ══ */
  const fetchChats = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/chats`);
      if (!res.ok) throw new Error(`Failed to fetch chats: ${res.statusText}`);
      const data = await res.json();
      const updatedSessions = (data.sessions || []).reverse().map((s) => ({
        ...s,
        lastMessage: s.messages?.[s.messages.length - 1]?.message || "",
      }));
      setSessions(updatedSessions);
    } catch (e) {
      setError("Failed to load chats. Please try again.");
      console.error("fetchChats error", e);
    }
  };

  const selectChat = async (_id) => {
    try {
      setError(null);
      setSidebarOpen(false);
      setChatId(_id);
      const res = await fetch(`${API_BASE}/chats/${_id}`);
      if (!res.ok) throw new Error(`Failed to fetch chat: ${res.statusText}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) {
      setError("Failed to load chat. Please try again.");
      console.error("selectChat error", e);
    }
  };

  const handleNewChat = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "New chat", reply: "Started a new chat" }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to create new chat: ${errorData.error || res.statusText}`);
      }
      const data = await res.json();
      setChatId(data.chat_id);
      setMessages([]);
      await fetchChats();
      setSidebarOpen(false);
    } catch (e) {
      setError(e.message || "Failed to create new chat. Please try again.");
      console.error("newChat error", e);
    }
  };

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() && !selectedFiles.length) return;
    if (input.startsWith("/")) {
      handleSlashCommand(input);
      return;
    }
    setLoading(true);
    setError(null);
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = {
      id: cryptoRandomId(),
      message: input,
      reply: "",
      files: selectedFiles,
      time: userTime,
      role: "user",
      status: "sent",
      replyTo: replyTo?.id || null,
      date: new Date().toDateString(),
    };
    setMessages((cur) => [...cur, newMessage]);
    setMessageStatus((prev) => ({ ...prev, [newMessage.id]: "sent" }));
    try {
      let res;
      if (selectedFiles.length) {
        const formData = new FormData();
        formData.append("message", input);
        if (chatId) formData.append("chat_id", chatId);
        selectedFiles.forEach((file) => formData.append("files", file));
        res = await fetch(`${API_BASE}/chat`, { method: "POST", body: formData });
      } else {
        const body = { message: input, chat_id: chatId };
        if (replyTo) body.replyTo = replyTo.id;
        res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.reply || `Failed to send message: ${res.statusText}`);
      }
      const data = await res.json();
      let replyText = data.reply || "⚠️ No reply.";
      const downloadUrl = data.download_url || null;
      try {
        const jsonReply = JSON.parse(replyText);
        if (jsonReply.type === "ats") {
          replyText = `ATS Score: ${jsonReply.score}/100\nFeedback: ${jsonReply.feedback}`;
        } else if (jsonReply.type === "ppt" || jsonReply.type === "pdf") {
          replyText = data.reply;
        }
      } catch (e) {}
      setMessageStatus((prev) => ({ ...prev, [newMessage.id]: "delivered" }));
      const assistantId = cryptoRandomId();
      setMessages((cur) => [
        ...cur,
        {
          id: assistantId,
          message: null,
          reply: "",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          role: "assistant",
          download_url: downloadUrl,
          date: new Date().toDateString(),
          type: getMessageType(replyText),
        },
      ]);
      let built = "";
      for (let i = 0; i < replyText.length; i++) {
        built += replyText[i];
        setMessages((cur) => {
          const copy = cur.slice();
          const idx = copy.findIndex((m) => m.id === assistantId);
          if (idx !== -1) copy[idx] = { ...copy[idx], reply: built };
          return copy;
        });
        await wait(5);
      }
      setMessageStatus((prev) => ({ ...prev, [newMessage.id]: "read" }));
      setChatId(data.chat_id || chatId);
      setInput("");
      setSelectedFiles([]);
      setReplyTo(null);
      addToast("Message sent successfully!");
      await fetchChats();
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
      console.error("chat error", err);
      setMessages((cur) => [
        ...cur,
        {
          id: cryptoRandomId(),
          message: null,
          reply: "⚠️ Error contacting server.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          role: "assistant",
          date: new Date().toDateString(),
        },
      ]);
      addToast("Failed to send message.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (index) => {
    if (!messages[index] || loading) return;
    const msg = messages[index];
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg.message, chat_id: chatId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.reply || `Failed to regenerate response: ${res.statusText}`);
      }
      const data = await res.json();
      let reply = data.reply || "⚠️ No reply.";
      const downloadUrl = data.download_url || null;
      try {
        const jsonReply = JSON.parse(reply);
        if (jsonReply.type === "ats") {
          reply = `ATS Score: ${jsonReply.score}/100\nFeedback: ${jsonReply.feedback}`;
        } else if (jsonReply.type === "ppt" || jsonReply.type === "pdf") {
          reply = data.reply;
        }
      } catch (e) {}
      const assistantIdx = messages.findIndex((m, i) => i > index && m.role === "assistant");
      if (assistantIdx !== -1) {
        let built = "";
        for (let i = 0; i < reply.length; i++) {
          built += reply[i];
          setMessages((cur) => {
            const copy = cur.slice();
            copy[assistantIdx] = {
              ...copy[assistantIdx],
              reply: built,
              download_url: downloadUrl,
              type: getMessageType(built),
            };
            return copy;
          });
          await wait(5);
        }
      } else {
        setMessages((cur) => [
          ...cur,
          {
            id: cryptoRandomId(),
            message: null,
            reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            role: "assistant",
            download_url: downloadUrl,
            date: new Date().toDateString(),
            type: getMessageType(reply),
          },
        ]);
      }
      addToast("Response regenerated successfully!");
    } catch (e) {
      setError(e.message || "Failed to regenerate response. Please try again.");
      console.error("regenerate error", e);
      addToast("Failed to regenerate response.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMessage = async (index) => {
    if (!messages[index] || loading) return;
    const msg = messages[index];
    setEditingMessageId(msg.id);
    setEditingMessageText(msg.message || "");
  };

  const handleSaveMessageEdit = async (index) => {
    if (!messages[index] || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editingMessageText, chat_id: chatId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.reply || `Failed to update message: ${res.statusText}`);
      }
      const data = await res.json();
      let replyText = data.reply || "⚠️ No reply.";
      const downloadUrl = data.download_url || null;
      try {
        const jsonReply = JSON.parse(replyText);
        if (jsonReply.type === "ats") {
          replyText = `ATS Score: ${jsonReply.score}/100\nFeedback: ${jsonReply.feedback}`;
        } else if (jsonReply.type === "ppt" || jsonReply.type === "pdf") {
          replyText = data.reply;
        }
      } catch (e) {}
      setMessages((cur) => {
        const copy = cur.slice();
        copy[index] = { ...copy[index], message: editingMessageText };
        const assistantIdx = cur.findIndex((m, i) => i > index && m.role === "assistant");
        if (assistantIdx !== -1) {
          copy[assistantIdx] = {
            ...copy[assistantIdx],
            reply: replyText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            download_url: downloadUrl,
            type: getMessageType(replyText),
          };
        } else {
          copy.push({
            id: cryptoRandomId(),
            message: null,
            reply: replyText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            role: "assistant",
            download_url: downloadUrl,
            date: new Date().toDateString(),
            type: getMessageType(replyText),
          });
        }
        return copy;
      });
      setEditingMessageId(null);
      setEditingMessageText("");
      addToast("Message updated successfully!");
      await fetchChats();
    } catch (e) {
      setError(e.message || "Failed to update message. Please try again.");
      console.error("edit message error", e);
      addToast("Failed to update message.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (_id) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/chats/${_id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete session: ${res.statusText}`);
      }
      if (chatId === _id) {
        setChatId(null);
        setMessages([]);
      }
      await fetchChats();
      addToast("Chat session deleted successfully!");
    } catch (e) {
      setError(e.message || "Failed to delete session. Please try again.");
      console.error("delete session error", e);
      addToast("Failed to delete session.", "error");
    }
  };

  const handleDeleteAll = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/chats`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to clear all chats: ${res.statusText}`);
      }
      setChatId(null);
      setMessages([]);
      await fetchChats();
      addToast("All chats cleared successfully!");
    } catch (e) {
      setError(e.message || "Failed to clear all chats. Please try again.");
      console.error("delete all error", e);
      addToast("Failed to clear all chats.", "error");
    }
  };

  const handleRenameSession = async (_id, newTitle) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/chats/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to rename session: ${res.statusText}`);
      }
      await fetchChats();
      setEditingSessionId(null);
      setEditingSessionTitle("");
      addToast("Session renamed successfully!");
    } catch (e) {
      setError(e.message || "Failed to rename session. Please try again.");
      console.error("rename session error", e);
      addToast("Failed to rename session.", "error");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    addToast(`${files.length} file(s) selected.`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    addToast(`${files.length} file(s) dropped.`);
  };

  const handleEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = (messageId, emoji) => {
    setReactions((prev) => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), emoji],
    }));
  };

  const handlePinMessage = (messageId) => {
    setPinnedMessages((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId]
    );
  };

  const handleReplyTo = (message) => {
    setReplyTo(message);
    textareaRef.current.focus();
  };

  const handleFavoriteSession = (_id) => {
    setFavorites((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
    );
  };

  const handleAddTag = (_id, tag) => {
    setTags((prev) => ({
      ...prev,
      [_id]: [...(prev[_id] || []), tag],
    }));
  };

  const handleRemoveTag = (_id, tag) => {
    setTags((prev) => ({
      ...prev,
      [_id]: prev[_id].filter((t) => t !== tag),
    }));
  };

  const handleExportSession = async (_id) => {
    try {
      const session = sessions.find((s) => s._id === _id);
      const res = await fetch(`${API_BASE}/chats/${_id}`);
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      const messages = data.messages || [];
      const jsonContent = JSON.stringify(messages, null, 2);
      const jsonBlob = new Blob([jsonContent], { type: "application/json" });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `${session.title || "Untitled"}.json`;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);
      const element = document.createElement("div");
      element.innerHTML = messages
        .map((m) => `<p><strong>${m.role}:</strong> ${m.message || m.reply}</p>`)
        .join("");
      await html2pdf().from(element).save(`${session.title || "Untitled"}.pdf`);
      addToast("Session exported successfully!");
    } catch (e) {
      addToast("Failed to export session.", "error");
    }
  };

  const handleDownloadResponse = (message, format) => {
    const content = message.reply || message.message;
    let blob, filename;
    if (format === "txt") {
      blob = new Blob([content], { type: "text/plain" });
      filename = `response.txt`;
    } else if (format === "pdf") {
      const element = document.createElement("div");
      element.innerHTML = `<p>${content}</p>`;
      html2pdf().from(element).save(`response.pdf`);
      addToast("Response downloaded as PDF!");
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Response downloaded as ${format.toUpperCase()}!`);
  };

  const handleSlashCommand = async (command) => {
    const [cmd, ...args] = command.slice(1).split(" ");
    switch (cmd.toLowerCase()) {
      case "reset":
        await handleDeleteAll();
        break;
      case "download":
        if (messages.length) handleDownloadResponse(messages[messages.length - 1], "txt");
        break;
      case "summary":
        setInput("Please summarize the conversation.");
        await handleSend();
        break;
      default:
        addToast("Unknown command.", "error");
    }
    setInput("");
  };

  const handleAutocomplete = (value) => {
    if (value.startsWith("/")) {
      const commands = ["/reset", "/download", "/summary"];
      setAutocompleteSuggestions(
        commands.filter((cmd) => cmd.startsWith(value.toLowerCase()))
      );
      setShowSuggestions(true);
    } else {
      const suggestions = messages
        .filter((m) => m.message && m.message.toLowerCase().includes(value.toLowerCase()))
        .map((m) => m.message)
        .slice(0, 5);
      setAutocompleteSuggestions(suggestions);
      setShowSuggestions(value.length > 1);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  const addToast = (message, type = "success") => {
    const id = cryptoRandomId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = chatMainRef.current.offsetWidth;
    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setChatAreaWidth(newWidth);
      chatMainRef.current.style.width = `${newWidth}px`;
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text || "");
    addToast("Text copied to clipboard!");
  };

  const filteredSessions = searchQuery
    ? sessions.filter((s) =>
        (s.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sessions;

  const groupedMessages = messages.reduce((acc, msg, idx) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push({ ...msg, index: idx });
    return acc;
  }, {});

  const renderFilePreview = (file) => {
    const type = file.type.split("/")[0];
    if (type === "image") {
      return <img src={URL.createObjectURL(file)} alt={file.name} className="file-preview-image" />;
    } else if (file.type === "application/pdf") {
      return <FileText size={24} />;
    } else {
      return <File size={24} />;
    }
  };

  const getAvatar = (role, userName = "User") => {
    if (role === "user") {
      return (
        <div className="avatar user-avatar" data-mag style={{ backgroundColor: "#3b82f6" }}>
          {userName[0].toUpperCase()}
        </div>
      );
    }
    return (
      <div className="avatar bot-avatar" data-mag>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          🤖
        </motion.div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div
      className={`chat-root ${theme === "dark" ? "theme-dark" : "theme-light"}`}
      style={{ fontSize: `${fontSize}px` }}
      role="application"
      aria-label="Chat Interface"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ── Magnetic cursor (Home.jsx exact) ── */}
      <MagneticCursor />

      {/* ── Ambient orbs (Home.jsx aesthetic) ── */}
      <div className="ch-orb ch-orb-1" />
      <div className="ch-orb ch-orb-2" />

      {/* ── Paper noise texture ── */}
      <div className="ch-noise" />

      {/* ── Toasts — spring slide from right ── */}
      <div className="toast-container" style={{ zIndex: 99998 }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast ${toast.type}`}
              initial={{ opacity: 0, x: 40, scale: 0.92 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit   ={{ opacity: 0, x: 40, scale: 0.88 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              {toast.message}
              <button data-mag onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ══ TOP BAR — navIn animation matching Home.jsx ══ */}
      <motion.header
        className="chat-topbar ch-topbar-in"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0   }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="left">
          <motion.button
            className="icon-btn" data-mag
            onClick={() => setSidebarOpen((s) => !s)}
            whileTap={{ scale: 0.88 }}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={sidebarOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0   }}
                exit   ={{ opacity: 0, rotate:  90 }}
                transition={{ duration: 0.17 }}
                style={{ display: "flex" }}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Logo mark (matches Home.jsx icon mark) */}
          <div data-mag style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
            background: "linear-gradient(135deg, var(--accent, #1a55e6), #7632e8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(26,85,230,0.28)",
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 5.5h8M5.5 1.5v8M1.5 1.5l8 8" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Brand in Cormorant italic */}
          <span className="brand ch-brand">ChatBot</span>
        </div>

        <div className="right">
          {/* Live status pill (Home.jsx green ripple) */}
          <div className="ch-live-pill">
            <div className="ch-live-dot" />
            <span className="ch-live-label">LIVE</span>
          </div>

          <select value={theme} onChange={(e) => setTheme(e.target.value)} data-mag aria-label="Select theme">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="custom">Custom</option>
          </select>

          <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} data-mag aria-label="Select font size">
            <option value={14}>Small</option>
            <option value={16}>Medium</option>
            <option value={18}>Large</option>
          </select>

          <motion.button
            className="theme-toggle" data-mag
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            whileHover={{ rotate: 15 }} whileTap={{ scale: 0.88 }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={theme}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.17 }} style={{ display: "flex" }}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* ── FABs — staggered spring entry ── */}
      <div className="fab-container">
        {[
          { icon: <Plus size={20} />,      action: handleNewChat,                                          label: "New chat",     magLabel: "NEW",  delay: 0.3  },
          { icon: <Paperclip size={20} />, action: () => document.querySelector(".file-input")?.click(), label: "Upload file",  magLabel: "FILE", delay: 0.4  },
        ].map(({ icon, action, label, magLabel, delay }) => (
          <motion.button
            key={label} className="fab" data-mag data-mag-label={magLabel}
            onClick={action} aria-label={label}
            initial={{ opacity: 0, scale: 0, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0  }}
            transition={{ delay, type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
          >{icon}</motion.button>
        ))}
      </div>

      {/* ══ LAYOUT ══ */}
      <div className="chat-layout" style={{ position: "relative", zIndex: 1 }}>

        {/* ── SIDEBAR — spring slide from left ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className={`chat-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0,    opacity: 1 }}
              exit   ={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              role="navigation"
              aria-label="Chat sessions"
            >
              <div className="sidebar-header">
                <div className="logo" data-mag title="ChatBot">⚪</div>
                <motion.button
                  className="icon-btn" data-mag
                  onClick={() => setSidebarCollapsed((s) => !s)}
                  whileTap={{ scale: 0.88 }}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
                </motion.button>
              </div>

              <div className="sidebar-actions">
                {[
                  { icon: <Plus size={16} />,   label: "New Chat",     action: handleNewChat,                      title: "New Chat"     },
                  { icon: <Search size={16} />, label: "Search Chats", action: () => setSearchOpen((s) => !s),     title: "Search Chats" },
                  { icon: <Book size={16} />,   label: "Library",      action: null,                               title: "Library"      },
                  { icon: <span style={{ fontSize:"14px", marginRight:"6px" }}>▶</span>, label: "Sora", action: null, title: "Sora" },
                  { icon: <span style={{ fontSize:"14px", marginRight:"6px" }}>◎</span>, label: "GPTs", action: null, title: "GPTs" },
                ].map(({ icon, label, action, title }, i) => (
                  <motion.button
                    key={label} className="sidebar-action" data-mag
                    onClick={action} aria-label={label} title={title}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0   }}
                    transition={{ delay: 0.05 * i, duration: 0.22 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}{!sidebarCollapsed && label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {searchOpen && !sidebarCollapsed && (
                  <motion.div
                    className="sidebar-search"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit   ={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search chat sessions"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!sidebarCollapsed && <h3 className="sidebar-section-title">Chats</h3>}

              <div className="sidebar-list" role="list">
                {filteredSessions.length === 0 && !sidebarCollapsed && (
                  <div className="no-sessions" role="status">No chats found</div>
                )}
                {filteredSessions
                  .sort((a, b) => (favorites.includes(b._id) ? 1 : -1))
                  .map((s, i) => (
                    <motion.div
                      key={s._id}
                      className={`session-item ${s._id === chatId ? "active" : ""}`}
                      onClick={() => selectChat(s._id)}
                      role="listitem" tabIndex={0}
                      title={sidebarCollapsed ? s.title || "Untitled" : ""}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0   }}
                      transition={{ delay: i * 0.035, duration: 0.2 }}
                      whileHover={{ x: 2 }}
                      data-clickable
                    >
                      {editingSessionId === s._id ? (
                        <input
                          className="session-edit"
                          value={editingSessionTitle}
                          onChange={(e) => setEditingSessionTitle(e.target.value)}
                          onBlur={() => handleRenameSession(s._id, editingSessionTitle)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleRenameSession(s._id, editingSessionTitle); }}
                          autoFocus
                          aria-label={`Edit title for chat ${s.title || "Untitled"}`}
                        />
                      ) : (
                        <div className="session-title">
                          {sidebarCollapsed ? (
                            <Star size={16} fill={favorites.includes(s._id) ? "#FFD700" : "none"} />
                          ) : (
                            <>
                              <Star
                                size={16}
                                fill={favorites.includes(s._id) ? "#FFD700" : "none"}
                                onClick={(e) => { e.stopPropagation(); handleFavoriteSession(s._id); }}
                              />
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: searchQuery
                                    ? (s.title || "Untitled").replace(
                                        new RegExp(searchQuery, "gi"),
                                        (match) => `<mark>${match}</mark>`
                                      )
                                    : s.title || "Untitled",
                                }}
                              />
                              <div className="session-preview">
                                {s.lastMessage.slice(0, 50) + (s.lastMessage.length > 50 ? "..." : "")}
                              </div>
                              <div className="session-tags">
                                {(tags[s._id] || []).map((tag) => (
                                  <span key={tag} className="tag">
                                    {tag}
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTag(s._id, tag); }}>
                                      <X size={12} />
                                    </button>
                                  </span>
                                ))}
                                <input
                                  type="text"
                                  placeholder="Add tag..."
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.target.value) {
                                      handleAddTag(s._id, e.target.value);
                                      e.target.value = "";
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="tag-input"
                                />
                              </div>
                              <button
                                className="icon-btn" data-mag
                                onClick={(e) => { e.stopPropagation(); handleExportSession(s._id); }}
                                aria-label="Export session"
                              >
                                <Download size={14} />
                              </button>
                            </>
                          )}
                          <button
                            className="icon-btn session-edit-btn" data-mag
                            onClick={(e) => { e.stopPropagation(); setEditingSessionId(s._id); setEditingSessionTitle(s.title || "Untitled"); }}
                            aria-label={`Edit title for chat ${s.title || "Untitled"}`}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                      <button
                        className="icon-btn session-delete" data-mag
                        onClick={(e) => { e.stopPropagation(); handleDeleteSession(s._id); }}
                        aria-label={`Delete chat ${s.title || "Untitled"}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
              </div>

              {!sidebarCollapsed && (
                <div className="sidebar-footer">
                  <motion.button
                    className="sidebar-action" data-mag
                    onClick={handleDeleteAll} aria-label="Clear all chats"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} /> Clear All
                  </motion.button>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="resize-handle" onMouseDown={handleResizeStart} ref={dragRef} />

        {/* ══ CHAT MAIN ══ */}
        <main
          className="chat-main"
          ref={chatMainRef}
          style={chatAreaWidth ? { width: `${chatAreaWidth}px` } : {}}
          role="main"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message" role="alert"
                style={{ backgroundColor: "var(--bg-error)" }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                {error}
                <motion.button className="icon-btn" data-mag onClick={() => setError(null)} whileTap={{ scale: 0.88 }} aria-label="Dismiss error">
                  <X size={14} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatBodyRef} className="chat-body" role="log" aria-live="polite">

            {/* Pinned messages */}
            <AnimatePresence>
              {pinnedMessages.length > 0 && (
                <motion.div
                  className="pinned-messages"
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  <h4>Pinned Messages</h4>
                  {pinnedMessages.map((id) => {
                    const msg = messages.find((m) => m.id === id);
                    if (!msg) return null;
                    return (
                      <div key={id} className="pinned-message">
                        {renderMessageContent(msg.message || msg.reply)}
                        <button data-mag onClick={() => handlePinMessage(id)} aria-label="Unpin message">
                          <Pin size={14} />
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {messages.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1   }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: "linear-gradient(135deg, var(--accent, #1a55e6), #7632e8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 28px rgba(26,85,230,0.28)", marginBottom: 8,
                  }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M2 11h18M11 2v18M2 2l18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </motion.div>
                <h3>✨ Start a Conversation</h3>
                <p>Type a message or upload a file to begin.</p>
              </motion.div>
            ) : (
              Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="message-group">
                  {msgs.map((m, mi) => (
                    <motion.div
                      key={m.id}
                      className={`message-row ${m.role === "user" ? "user" : "assistant"} ${
                        pinnedMessages.includes(m.id) ? "pinned" : ""
                      }`}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      transition={{ duration: 0.3, delay: mi < 4 ? mi * 0.055 : 0, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {getAvatar(m.role)}

                      <motion.div
                        className={`message ${m.role === "user" ? "message-user" : "message-bot"} message-bubble`}
                        style={{ background: m.role === "user" ? "var(--bg-user)" : "var(--bg-bot)" }}
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.18 }}
                      >
                        {m.replyTo && (
                          <div className="quoted-message">
                            <Quote size={14} />
                            {renderMessageContent(
                              messages.find((msg) => msg.id === m.replyTo)?.message ||
                              messages.find((msg) => msg.id === m.replyTo)?.reply
                            )}
                          </div>
                        )}

                        {m.role === "user" && editingMessageId === m.id ? (
                          <div className="message-content">
                            <textarea
                              value={editingMessageText}
                              onChange={(e) => setEditingMessageText(e.target.value)}
                              className="message-edit-textarea"
                              autoFocus
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSaveMessageEdit(m.index); }}
                              aria-label="Edit message"
                            />
                            <div className="message-edit-actions">
                              <motion.button className="meta-btn" data-mag whileTap={{ scale: 0.92 }}
                                onClick={() => handleSaveMessageEdit(m.index)} disabled={loading} aria-label="Save edited message">
                                Save
                              </motion.button>
                              <motion.button className="meta-btn" data-mag whileTap={{ scale: 0.92 }}
                                onClick={() => setEditingMessageId(null)} aria-label="Cancel edit">
                                Cancel
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <div className="message-content">
                            {m.role === "user" && renderMessageContent(m.message)}
                            {m.role === "assistant" && (
                              <>
                                {m.reply === "" && loading ? (
                                  <TypingDots />
                                ) : (
                                  <>
                                    {m.type && <span className="message-type">{m.type}</span>}
                                    {renderMessageContent(m.reply, true, (newCode) => {
                                      setMessages((cur) => {
                                        const copy = cur.slice();
                                        copy[m.index] = { ...copy[m.index], reply: newCode };
                                        return copy;
                                      });
                                    })}
                                    <div className="suggested-prompts">
                                      {["Explain More", "Simplify", "Generate Code"].map((lbl) => (
                                        <motion.button key={lbl} data-mag
                                          whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                                          onClick={() => setInput(
                                            lbl === "Explain More"
                                              ? `Explain more about: ${m.reply.slice(0, 20)}...`
                                              : lbl === "Simplify"
                                              ? `Simplify this: ${m.reply.slice(0, 20)}...`
                                              : `Generate code snippet for: ${m.reply.slice(0, 20)}...`
                                          )}
                                        >{lbl}</motion.button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}

                        {m.files && m.files.length > 0 && (
                          <div className="attached-files">
                            {m.files.map((file, idx) => (
                              <div key={idx} className="file-preview" aria-label={`Attached file: ${file.name}`}>
                                {renderFilePreview(file)}
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {m.download_url && (
                          <div className="attached-file">
                            <a href={`${API_BASE}${m.download_url}`} download>
                              <Download size={18} /> Download File
                            </a>
                          </div>
                        )}

                        <div className="message-meta">
                          <div className="meta-left">
                            {/* Copy */}
                            <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                              onClick={() => copyText(m.role === "user" ? m.message : m.reply)} title="Copy text" aria-label="Copy message">
                              <Copy size={14} />
                            </motion.button>
                            {/* Edit (user) */}
                            {m.role === "user" && (
                              <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                                onClick={() => handleEditMessage(m.index)} disabled={loading} title="Edit message" aria-label="Edit message">
                                <Edit2 size={14} />
                              </motion.button>
                            )}
                            {/* Regen + downloads (assistant) */}
                            {m.role === "assistant" && (
                              <>
                                <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                                  onClick={() => handleRegenerate(m.index)} disabled={loading} title="Regenerate response" aria-label="Regenerate response">
                                  <RefreshCcw size={14} />
                                </motion.button>
                                <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                                  onClick={() => handleDownloadResponse(m, "txt")} title="Download as TXT" aria-label="Download as TXT">
                                  <Download size={14} />
                                </motion.button>
                                <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                                  onClick={() => handleDownloadResponse(m, "pdf")} title="Download as PDF" aria-label="Download as PDF">
                                  <FileText size={14} />
                                </motion.button>
                              </>
                            )}
                            {/* Pin */}
                            <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                              onClick={() => handlePinMessage(m.id)}
                              title={pinnedMessages.includes(m.id) ? "Unpin message" : "Pin message"}
                              aria-label={pinnedMessages.includes(m.id) ? "Unpin message" : "Pin message"}>
                              <Pin size={14} fill={pinnedMessages.includes(m.id) ? "#FFD700" : "none"} />
                            </motion.button>
                            {/* Reply */}
                            <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                              onClick={() => handleReplyTo(m)} title="Reply to message" aria-label="Reply to message">
                              <Quote size={14} />
                            </motion.button>
                            {/* Reactions */}
                            <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                              onClick={() => handleReaction(m.id, "👍")} title="React with thumbs up" aria-label="React with thumbs up">
                              <ThumbsUp size={14} />
                            </motion.button>
                            <motion.button className="meta-btn" data-mag whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                              onClick={() => handleReaction(m.id, "❤️")} title="React with heart" aria-label="React with heart">
                              <Heart size={14} />
                            </motion.button>
                          </div>
                          <div className="meta-right">
                            {m.time}
                            {m.role === "user" && (
                              <span className="status-indicator">
                                {messageStatus[m.id] === "sent"      && "✓"}
                                {messageStatus[m.id] === "delivered" && "✓✓"}
                                {messageStatus[m.id] === "read"      && <span style={{ color: "#3b82f6" }}>✓✓</span>}
                              </span>
                            )}
                          </div>
                        </div>

                        {reactions[m.id] && (
                          <div className="reactions">
                            {reactions[m.id].map((r, idx) => (
                              <motion.span key={idx} className="reaction"
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 380, damping: 18 }}>
                                {r}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ))
            )}
            {loading && messages.length > 0 && <LoadingSkeleton />}
          </div>

          {/* ══ INPUT AREA — fadeUp entry ══ */}
          <motion.form
            className="chat-input-area"
            id="grok-form"
            onSubmit={handleSend}
            role="form"
            aria-label="Message input form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <motion.button
              className="emoji-btn" type="button" data-mag
              onClick={() => setShowEmojiPicker((s) => !s)}
              whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.88 }}
              aria-label="Open emoji picker"
            >
              😊
            </motion.button>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  className="emoji-picker"
                  initial={{ opacity: 0, scale: 0.88, y: 10 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit   ={{ opacity: 0, scale: 0.88, y: 10 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </motion.div>
              )}
            </AnimatePresence>

            <label className="file-label" title="Attach files" data-mag>
              <input
                type="file" multiple onChange={handleFileChange}
                className="file-input" disabled={loading} aria-label="Upload files"
              />
              <Paperclip size={18} />
            </label>

            <div className="textarea-container">
              <AnimatePresence>
                {replyTo && (
                  <motion.div
                    className="reply-preview"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  >
                    Replying to: {replyTo.message || replyTo.reply?.slice(0, 20)}...
                    <button data-mag onClick={() => setReplyTo(null)} aria-label="Cancel reply">
                      <X size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                ref={textareaRef}
                className="chat-textarea"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => { setInput(e.target.value); handleAutocomplete(e.target.value); }}
                disabled={loading}
                rows={1}
                aria-label="Message input"
              />

              <AnimatePresence>
                {showSuggestions && autocompleteSuggestions.length > 0 && (
                  <motion.div
                    className="autocomplete-suggestions"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  >
                    {autocompleteSuggestions.map((s, idx) => (
                      <div key={idx} className="suggestion" data-clickable onClick={() => handleSuggestionSelect(s)}>{s}</div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selectedFiles.length > 0 && (
              <div className="file-chips">
                {selectedFiles.map((file, idx) => (
                  <motion.div
                    key={idx} className="file-chip" aria-label={`Attached file: ${file.name}`}
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {file.name.length > 20 ? file.name.slice(0, 17) + "..." : file.name}
                    <button
                      className="file-chip-close" data-mag type="button" aria-label="Remove attached file"
                      onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.button
              className="btn-send" type="submit" data-mag data-mag-label="SEND"
              disabled={loading || (!input.trim() && !selectedFiles.length)}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
              aria-label="Send message"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={loading ? "loading" : "send"}
                  initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.15 }} style={{ display: "flex" }}
                >
                  {loading
                    ? <div className="ch-spinner" />
                    : <Send size={18} />
                  }
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </main>
      </div>
    </div>
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cryptoRandomId() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
}