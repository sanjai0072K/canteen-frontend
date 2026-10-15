
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE, getErrorMessage } from "../api";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !applicationNumber.trim()) {
      setError("Please enter your name and application number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        name: name.trim(),
        applicationNumber: applicationNumber.trim(),
      });

      if (!response.data || !response.data.student) {
        setError("Invalid server response. Please try again.");
        return;
      }

      onLogin(response.data.student);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "var(--bg, #f4f7fb)",
      color: "var(--text, #172b4d)",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 6%",
      background: "var(--surface, #ffffff)",
      borderBottom: "1px solid var(--border, #e1e7ef)",
      gap: "12px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      color: "var(--text, #172b4d)",
    },
    logoIcon: {
      display: "grid",
      placeItems: "center",
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: "var(--surface-soft, #eaf1fc)",
      fontSize: "24px",
    },
    brand: {
      display: "block",
      fontSize: "20px",
      fontWeight: 800,
    },
    caption: {
      display: "block",
      marginTop: "4px",
      fontSize: "9px",
      letterSpacing: "1.5px",
      color: "var(--muted, #718096)",
    },
    home: {
      color: "var(--primary, #1766b1)",
      textDecoration: "none",
      fontWeight: 700,
      fontSize: "14px",
    },
    main: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
    },
    hero: {
      padding: "clamp(30px, 6vw, 75px)",
      background: "linear-gradient(145deg, #123d70, #1766b1 70%, #d83b48)",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    tag: {
      alignSelf: "flex-start",
      padding: "9px 12px",
      border: "1px solid #ffffff55",
      borderRadius: "25px",
      fontSize: "11px",
      fontWeight: 700,
    },
    heading: {
      margin: "25px 0 15px",
      fontSize: "clamp(36px, 5vw, 56px)",
      lineHeight: 1.15,
      color: "#ffffff",
    },
    description: {
      maxWidth: "430px",
      color: "#e5edfa",
      fontSize: "14px",
      lineHeight: 1.9,
    },
    benefits: {
      display: "grid",
      gap: "16px",
      marginTop: "25px",
      fontSize: "14px",
    },
    formSection: {
      display: "grid",
      placeItems: "center",
      padding: "35px 20px",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      boxSizing: "border-box",
      padding: "clamp(24px, 4vw, 38px)",
      border: "1px solid var(--border, #e1e7ef)",
      borderRadius: "20px",
      background: "var(--surface, #ffffff)",
      boxShadow: "0 15px 45px #102b4d12",
    },
    avatar: {
      display: "grid",
      placeItems: "center",
      width: "52px",
      height: "52px",
      borderRadius: "15px",
      background: "var(--surface-soft, #eaf1fc)",
      fontSize: "26px",
      marginBottom: "20px",
    },
    eyebrow: {
      color: "var(--primary, #1766b1)",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "1.5px",
    },
    title: {
      margin: "10px 0",
      fontSize: "29px",
      color: "var(--text, #172b4d)",
    },
    subtitle: {
      margin: "0 0 25px",
      color: "var(--muted, #718096)",
      fontSize: "13px",
      lineHeight: 1.7,
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "13px",
      fontWeight: 700,
      color: "var(--text, #172b4d)",
    },
    input: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      padding: "14px",
      marginBottom: "20px",
      border: "1px solid var(--border, #d9e2ef)",
      borderRadius: "10px",
      background: "var(--input-bg, var(--surface, #ffffff))",
      color: "var(--text, #172b4d)",
      fontSize: "14px",
      outlineColor: "var(--primary, #1766b1)",
    },
    error: {
      display: "flex",
      gap: "10px",
      padding: "12px",
      marginBottom: "16px",
      borderRadius: "9px",
      background: "var(--danger-bg, #fff0f0)",
      border: "1px solid #d83b4840",
      color: "var(--danger, #b42332)",
      fontSize: "13px",
      lineHeight: 1.6,
      overflowWrap: "anywhere",
    },
    button: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
      padding: "15px 17px",
      border: "none",
      borderRadius: "10px",
      background: "var(--primary, #1766b1)",
      color: "#ffffff",
      fontWeight: 700,
      fontSize: "14px",
      cursor: loading ? "wait" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "25px 0 18px",
      color: "var(--muted, #718096)",
      fontSize: "10px",
    },
    dividerLine: {
      height: "1px",
      flex: 1,
      background: "var(--border, #e1e7ef)",
    },
    register: {
      textAlign: "center",
      fontSize: "13px",
      color: "var(--muted, #718096)",
    },
    registerLink: {
      color: "var(--primary, #1766b1)",
      fontWeight: 800,
      textDecoration: "none",
    },
    security: {
      marginTop: "24px",
      paddingTop: "16px",
      borderTop: "1px solid var(--border, #e1e7ef)",
      textAlign: "center",
      color: "var(--muted, #718096)",
      fontSize: "11px",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "10px",
      padding: "18px 6%",
      background: "var(--surface, #ffffff)",
      borderTop: "1px solid var(--border, #e1e7ef)",
      color: "var(--muted, #718096)",
      fontSize: "11px",
    },
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍱</span>
          <span>
            <strong style={styles.brand}>
              Campus<span style={{ color: "#d83b48" }}>Bite</span>
            </strong>
            <small style={styles.caption}>COLLEGE CANTEEN</small>
          </span>
        </Link>

        <Link to="/" style={styles.home}>
          ← Home
        </Link>
      </nav>

      <main style={styles.main}>
        <section style={styles.hero}>
          <span style={styles.tag}>🎓 YOUR CAMPUS, YOUR FOOD</span>

          <h1 style={styles.heading}>
            Your next meal
            <br />
            starts <span style={{ color: "#ffb6bd" }}>here.</span>
          </h1>

          <p style={styles.description}>
            Sign in to explore the canteen menu, pre-order your favourite
            meals and keep track of your orders, all in one place.
          </p>

          <div style={styles.benefits}>
            <div>✓ &nbsp; Easy food pre-ordering</div>
            <div>✓ &nbsp; Simple order tracking</div>
            <div>✓ &nbsp; Convenient pickup planning</div>
          </div>

          <div style={{ fontSize: "65px", marginTop: "25px" }}>🥗</div>
        </section>

        <section style={styles.formSection}>
          <div style={styles.card}>
            <div style={styles.avatar}>👋</div>

            <span style={styles.eyebrow}>STUDENT PORTAL</span>
            <h2 style={styles.title}>Welcome back!</h2>
            <p style={styles.subtitle}>
              Enter your details to access your account.
            </p>

            <form onSubmit={submit}>
              <label htmlFor="student-name" style={styles.label}>
                Student Name
              </label>
              <input
                id="student-name"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="application-number" style={styles.label}>
                Application Number
              </label>
              <input
                id="application-number"
                style={styles.input}
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                placeholder="Enter your application number"
                autoComplete="username"
                required
              />

              {error && (
                <div role="alert" style={styles.error}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                style={styles.button}
                disabled={loading}
              >
                <span>{loading ? "Signing in..." : "Sign In to Your Account"}</span>
                {!loading && <span>→</span>}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span>NEW TO CAMPUSBITE?</span>
              <span style={styles.dividerLine} />
            </div>

            <p style={styles.register}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.registerLink}>
                Register here
              </Link>
            </p>

            <p style={styles.security}>
              🔒 Student access · Secure sign-in
            </p>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <span>© 2026 CampusBite</span>
        <span>Made for campus life ❤️</span>
      </footer>
    </div>
  );
}
