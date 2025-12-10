import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";

/**
 * Enhanced Login.jsx
 * - Password strength meter
 * - Terms checkbox for signup
 * - Remember me persistence
 * - Client-side rate limiting (lockout after repeated failures)
 * - Demo account autofill
 * - Resend verification email
 * - Last-login audit info (from localStorage)
 *
 * Notes:
 * - Keep your existing Firebase config. This component uses the same firebase imports you had.
 * - For production rate-limiting and anti-bot protections, wire server-side checks and CAPTCHAs.
 */

const Login = ({ handleLogin }) => {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsChecked, setTermsChecked] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [passwordScore, setPasswordScore] = useState(0);
  const navigate = useNavigate();

  // Load rate-limit from localStorage
  useEffect(() => {
    const storedAttempts = Number(localStorage.getItem("scp_login_attempts") || 0);
    const storedLockedUntil = Number(localStorage.getItem("scp_locked_until") || 0);
    setLoginAttempts(storedAttempts);
    if (storedLockedUntil && storedLockedUntil > Date.now()) {
      setLockedUntil(storedLockedUntil);
    } else {
      localStorage.removeItem("scp_locked_until");
    }
  }, []);

  // Auth state watcher - existing logic preserved
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && storedUser) {
        localStorage.removeItem("user");
      } else if (user && storedUser) {
        setIsAlreadyLoggedIn(true);
        navigate("/predict");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // password strength heuristic (simple)
  useEffect(() => {
    const score = calcPasswordScore(password);
    setPasswordScore(score);
  }, [password]);

  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(password);

  function calcPasswordScore(pw = "") {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[@#$%^&+=!]/.test(pw)) score += 1;
    return score; // 0..5
  }

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  // Client-side lockout helpers
  const recordFailedAttempt = () => {
    const next = loginAttempts + 1;
    localStorage.setItem("scp_login_attempts", String(next));
    setLoginAttempts(next);

    if (next >= 5) {
      // lock for 60 seconds (example). Use server-side in prod.
      const until = Date.now() + 60_000;
      localStorage.setItem("scp_locked_until", String(until));
      setLockedUntil(until);
      setErrorMsg("Too many failed attempts. Locked for 60 seconds.");
    } else {
      setErrorMsg(`Login failed. ${5 - next} attempts left before temporary lock.`);
    }
  };

  useEffect(() => {
    if (!lockedUntil) return;
    const timer = setInterval(() => {
      if (Date.now() > lockedUntil) {
        setLockedUntil(null);
        localStorage.removeItem("scp_locked_until");
        localStorage.setItem("scp_login_attempts", "0");
        setLoginAttempts(0);
        setErrorMsg("");
      } else {
        // update message with remaining seconds
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
        setErrorMsg(`Too many failed attempts — please try again in ${remaining}s`);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  /* ---------------------- Auth Flows ---------------------- */
  const handleEmailSignup = async () => {
    resetMessages();
    if (!isValidGmail(email)) return setErrorMsg("❗ Use a valid Gmail");
    if (!isStrongPassword(password)) return setErrorMsg("❗ Weak password. Use upper, lower, digit & symbol.");
    if (!termsChecked) return setErrorMsg("❗ Please accept Terms & Privacy policy.");

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // send verification email
      try {
        await sendEmailVerification(cred.user);
        setSuccessMsg("✅ Signup successful! Verification email sent.");
      } catch (verErr) {
        // still proceed if verification fails
        console.warn("Verification email failed:", verErr);
        setSuccessMsg("✅ Signup successful! (verification email error)");
      }

      // persist user if 'remember me'
      const formattedUser = {
        name: cred.user.displayName || email.split("@")[0],
        email: cred.user.email,
        uid: cred.user.uid,
        photo: cred.user.photoURL || null,
      };
      if (rememberMe) localStorage.setItem("user", JSON.stringify(formattedUser));

      // save last-login audit
      localStorage.setItem("scp_last_login", JSON.stringify({ email: formattedUser.email, time: Date.now(), mode: "signup" }));

      handleLogin();
      navigate("/predict");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("❌ Signup failed: " + (error.message || error.code || "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    resetMessages();
    if (lockedUntil && Date.now() < lockedUntil) {
      setErrorMsg("Temporarily locked due to multiple failed attempts.");
      return;
    }
    if (!isValidGmail(email)) return setErrorMsg("❗ Use a valid Gmail");

    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const formattedUser = {
        name: cred.user.displayName || email.split("@")[0],
        email: cred.user.email,
        uid: cred.user.uid,
        photo: cred.user.photoURL || null,
      };

      // save to localStorage based on rememberMe
      if (rememberMe) localStorage.setItem("user", JSON.stringify(formattedUser));
      else localStorage.removeItem("user");

      // reset attempt counters on success
      localStorage.setItem("scp_login_attempts", "0");
      setLoginAttempts(0);

      // audit log
      localStorage.setItem("scp_last_login", JSON.stringify({ email: formattedUser.email, time: Date.now(), mode: "email" }));

      setSuccessMsg("✅ Login successful!");
      handleLogin();
      navigate("/predict");
    } catch (error) {
      console.error("Login error:", error);
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider, providerName) => {
    resetMessages();
    if (loading) return;
    if (lockedUntil && Date.now() < lockedUntil) {
      setErrorMsg("Temporarily locked due to multiple failed attempts.");
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const formattedUser = {
        name: user.displayName || user.email?.split("@")[0],
        email: user.email,
        uid: user.uid,
        photo: user.photoURL,
      };
      if (rememberMe) localStorage.setItem("user", JSON.stringify(formattedUser));

      // reset attempt counters on success
      localStorage.setItem("scp_login_attempts", "0");
      setLoginAttempts(0);

      localStorage.setItem("scp_last_login", JSON.stringify({ email: formattedUser.email, time: Date.now(), mode: providerName }));

      setSuccessMsg(`🎉 Welcome ${formattedUser.name}!`);
      handleLogin();
      navigate("/predict");
    } catch (error) {
      console.error(`${providerName} login failed`, error);
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    resetMessages();
    if (!isValidGmail(email)) return setErrorMsg("❗ Enter a valid Gmail");
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("✅ Password reset email sent!");
    } catch (error) {
      console.error("Reset error:", error);
      setErrorMsg("❌ Failed to send reset email: " + (error.message || "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    resetMessages();
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setErrorMsg("No user session found to resend verification. Please sign in first.");
      } else {
        await sendEmailVerification(user);
        setSuccessMsg("✅ Verification email resent!");
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      setErrorMsg("Failed to resend verification: " + (err.message || "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  // Demo quick-fill — useful for HR demo
  const fillDemoAccount = () => {
    setEmail("demo.smartcareer@gmail.com");
    setPassword("Demo@1234");
    setMode("login");
    setSuccessMsg("Demo credentials filled — click Login");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // small UI for last login audit
  const lastLogin = (() => {
    try {
      return JSON.parse(localStorage.getItem("scp_last_login") || "null");
    } catch {
      return null;
    }
  })();

  if (isAlreadyLoggedIn) return null;

  return (
    <div className="login-container" aria-live="polite">
      {loading && <div className="loading-overlay" aria-hidden="true">Loading...</div>}

      <div className="login-card" role="region" aria-label="Secure login card">
        <h1 className="login-title">Secure Access</h1>
        <p className="login-subtitle">Sign in or sign up with your Gmail or Google account</p>

        <div className="mode-toggle" role="tablist" aria-label="Authentication mode">
          <button
            className={`mode-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
            disabled={loading}
            role="tab"
            aria-selected={mode === "login"}
          >
            Login
          </button>
          <button
            className={`mode-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
            disabled={loading}
            role="tab"
            aria-selected={mode === "signup"}
          >
            Sign Up
          </button>
        </div>

        <div className="form-group">
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            disabled={loading}
            className="input-field"
            aria-required="true"
          />

          <div className="password-field" style={{ position: "relative" }}>
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password (8+ chars, aA1@)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="input-field"
              aria-describedby="pw-help pw-strength"
              aria-required="true"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

            {/* Password strength meter */}
            <div id="pw-strength" className="pw-strength" aria-hidden="false">
              <div className={`pw-bar s-${passwordScore}`} />
              <div className="pw-label">
                {passwordScore <= 1 && <span style={{ color: "#ef4444" }}>Weak</span>}
                {passwordScore === 2 && <span style={{ color: "#f59e0b" }}>Fair</span>}
                {passwordScore === 3 && <span style={{ color: "#06b6d4" }}>Good</span>}
                {passwordScore >= 4 && <span style={{ color: "#0b69d6" }}>Strong</span>}
              </div>
            </div>

            <div id="pw-help" className="pw-help" aria-hidden="false">
              <small>
                Use at least 8 chars, including <strong>upper</strong>, <strong>lower</strong>, <strong>digit</strong> and <strong>symbol</strong>.
              </small>
            </div>
          </div>
        </div>

        {/* messages */}
        {errorMsg && <div className="error-msg" role="alert">{errorMsg}</div>}
        {successMsg && <div className="success-msg" role="status">{successMsg}</div>}

        {/* Remember & terms */}
        <div className="login-helpers" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              aria-label="Remember me"
            />
            <span style={{ fontSize: 14, color: "#374151" }}>Remember me</span>
          </label>

          {mode === "signup" && (
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", marginLeft: 6 }}>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                disabled={loading}
                aria-label="Accept terms and privacy"
              />
              <span style={{ fontSize: 14, color: "#374151" }}>
                I accept the <button className="link-like" onClick={() => navigate("/privacy")}>Privacy Policy</button>
              </span>
            </label>
          )}
        </div>

        {/* primary actions */}
        <div style={{ marginTop: 16 }}>
          {mode === "signup" ? (
            <button
              className="primary-btn"
              onClick={handleEmailSignup}
              disabled={loading || !termsChecked}
              aria-disabled={loading || !termsChecked}
            >
              {loading ? <span className="spinner" /> : "Sign Up with Email"}
            </button>
          ) : (
            <>
              <button
                className="primary-btn"
                onClick={handleEmailLogin}
                disabled={loading || !!(lockedUntil && Date.now() < lockedUntil)}
                aria-disabled={loading || !!(lockedUntil && Date.now() < lockedUntil)}
              >
                {loading ? <span className="spinner" /> : "Login with Email"}
              </button>

              <button
                className="forgot-btn"
                onClick={handleForgotPassword}
                disabled={loading}
                style={{ marginLeft: 12 }}
              >
                Forgot Password?
              </button>
            </>
          )}
        </div>

        <div className="divider" aria-hidden="true">or</div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <button
            className="google-btn"
            onClick={() => handleSocialLogin(googleProvider, "Google")}
            disabled={loading || !!(lockedUntil && Date.now() < lockedUntil)}
          >
            {loading ? <span className="spinner" /> : (
              <>
                <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
                Continue with Google
              </>
            )}
          </button>

          {/* Demo quick button */}
          <button className="demo-btn" onClick={fillDemoAccount} disabled={loading}>
            Try Demo Account
          </button>
        </div>

        {/* Resend verification (helpful after signup) */}
        <div style={{ marginTop: 12 }}>
          <button className="link-like" onClick={resendVerification} disabled={loading}>
            Resend verification email
          </button>
        </div>

        {/* Last login audit for transparency */}
        {lastLogin && (
          <div className="last-login" style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
            Last activity: <strong>{new Date(lastLogin.time).toLocaleString()}</strong> via <strong>{lastLogin.mode}</strong> ({lastLogin.email})
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
