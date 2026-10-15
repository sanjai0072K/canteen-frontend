
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE, getErrorMessage } from "../api";

export default function RegisterPage({ onRegistered }) {
  const [form, setForm] = useState({
    name: "",
    department: "",
    applicationNumber: "",
    collegeName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const body = {
      name: form.name.trim(),
      department: form.department.trim(),
      applicationNumber: form.applicationNumber.trim(),
      collegeName: form.collegeName.trim(),
    };

    if (Object.values(body).some((value) => !value)) {
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/auth/register`,
        body
      );

      if (!response.data || !response.data.student) {
        setError("Registration response is invalid. Please try again.");
        return;
      }

      onRegistered(response.data.student);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg, #f4f7fb)",
      color: "var(--text, #172b4d)",
      fontFamily: "Arial, sans-serif",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 6%",
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
      fontSize: "14px",
      fontWeight: 700,
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
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "1px",
    },
    heading: {
      margin: "25px 0 15px",
      fontSize: "clamp(35px, 5vw, 55px)",
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
      fontSize: "13px",
    },
    formSection: {
      display: "grid",
      placeItems: "center",
      padding: "35px 20px",
    },
    card: {
      width: "100%",
      maxWidth: "470px",
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
      width: "50px",
      height: "50px",
      borderRadius: "15px",
      background: "var(--surface-soft, #eaf1fc)",
      fontSize: "25px",
      marginBottom: "18px",
    },
    eyebrow: {
      color: "var(--primary, #1766b1)",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.5px",
    },
    title: {
      margin: "10px 0",
      fontSize: "28px",
      color: "var(--text, #172b4d)",
    },
    subtitle: {
      margin: "0 0 23px",
      color: "var(--muted, #718096)",
      fontSize: "13px",
      lineHeight: 1.7,
    },
    label: {
      display: "block",
      marginBottom: "7px",
      fontSize: "12px",
      fontWeight: 700,
      color: "var(--text, #172b4d)",
    },
    input: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      marginBottom: "17px",
      border: "1px solid var(--border, #d9e2ef)",
      borderRadius: "10px",
      background: "var(--input-bg, var(--surface, #ffffff))",
      color: "var(--text, #172b4d)",
      fontSize: "13px",
      outlineColor: "var(--primary, #1766b1)",
    },
    error: {
      display: "flex",
      gap: "9px",
      padding: "12px",
      marginBottom: "16px",
      borderRadius: "9px",
      background: "var(--danger-bg, #fff0f0)",
      border: "1px solid #d83b4840",
      color: "var(--danger, #b42332)",
      fontSize: "12px",
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
      fontSize: "13px",
      cursor: loading ? "wait" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
    loginText: {
      marginTop: "22px",
      textAlign: "center",
      fontSize: "13px",
      color: "var(--muted, #718096)",
    },
    loginLink: {
      color: "var(--primary, #1766b1)",
      fontWeight: 800,
      textDecoration: "none",
    },
    security: {
      marginTop: "22px",
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
          <span style={styles.tag}>🎓 JOIN YOUR CAMPUS</span>

          <h1 style={styles.heading}>
            Your campus.
            <br />
            Your food.
            <br />
            <span style={{ color: "#ffb6bd" }}>Your way.</span>
          </h1>

          <p style={styles.description}>
            Create your student account and make canteen ordering simpler.
            Explore the menu, plan your pickup and keep track of your orders.
          </p>

          <div style={styles.benefits}>
            <div>✓ &nbsp; Quick student registration</div>
            <div>✓ &nbsp; Easy meal pre-ordering</div>
            <div>✓ &nbsp; Track your canteen orders</div>
          </div>

          <div style={{ fontSize: "65px", marginTop: "25px" }}>🥪</div>
        </section>

        <section style={styles.formSection}>
          <div style={styles.card}>
            <div style={styles.avatar}>📝</div>

            <span style={styles.eyebrow}>STUDENT PORTAL</span>
            <h2 style={styles.title}>Create your account</h2>
            <p style={styles.subtitle}>
              Fill in your student details to get started.
            </p>

            <form onSubmit={submit}>
              <label htmlFor="register-name" style={styles.label}>
                Student Name
              </label>
              <input
                id="register-name"
                style={styles.input}
                value={form.name}
                onChange={update("name")}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="register-department" style={styles.label}>
                Department
              </label>
              <input
                id="register-department"
                style={styles.input}
                value={form.department}
                onChange={update("department")}
                placeholder="Example: CSE"
                required
              />

              <label htmlFor="register-application" style={styles.label}>
                Application Number
              </label>
              <input
                id="register-application"
                style={styles.input}
                value={form.applicationNumber}
                onChange={update("applicationNumber")}
                placeholder="Enter your application number"
                autoComplete="username"
                required
              />

              <label htmlFor="register-college" style={styles.label}>
                College Name
              </label>
              <input
                id="register-college"
                style={styles.input}
                value={form.collegeName}
                onChange={update("collegeName")}
                placeholder="Enter your college name"
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
                <span>{loading ? "Creating account..." : "Create Student Account"}</span>
                {!loading && <span>→</span>}
              </button>
            </form>

            <p style={styles.loginText}>
              Already registered?{" "}
              <Link to="/login" style={styles.loginLink}>
                Login here
              </Link>
            </p>

            <p style={styles.security}>
              🔒 Student registration · Secure access
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
