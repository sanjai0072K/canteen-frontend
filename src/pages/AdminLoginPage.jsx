
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, getErrorMessage } from "../api";
import { saveAdminToken } from "../adminAuth";

export default function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/admin/login`, {
        username: username.trim(),
        password,
      });

      if (!res.data?.token) {
        setError("Login failed. Admin token was not received.");
        return;
      }

      saveAdminToken(res.data.token);

      if (onLogin) {
        onLogin();
      }

      navigate("/admin/tokens");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <style>{`
        .admin-login-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px 20px;
          color: var(--text);
        }

        .admin-login-layout {
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          width: 100%;
          max-width: 920px;
          min-height: 510px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 26px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .admin-login-banner {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 36px;
          color: #fff;
          background: linear-gradient(145deg, #1d4ed8 0%, #2563eb 55%, #dc2626 100%);
        }

        .admin-login-banner::before,
        .admin-login-banner::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(255,255,255,0.17);
          border-radius: 50%;
          pointer-events: none;
        }

        .admin-login-banner::before {
          width: 280px;
          height: 280px;
          right: -100px;
          top: 100px;
          box-shadow: 0 0 0 35px rgba(255,255,255,0.035),
                      0 0 0 70px rgba(255,255,255,0.025);
        }

        .admin-login-banner::after {
          width: 150px;
          height: 150px;
          left: -75px;
          bottom: 35px;
        }

        .admin-login-brand,
        .admin-login-banner-content,
        .admin-login-banner-footer {
          position: relative;
          z-index: 1;
        }

        .admin-login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-login-brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 15px;
          background: rgba(255,255,255,0.16);
          font-size: 25px;
        }

        .admin-login-brand-name {
          margin: 0;
          font-size: 17px;
          font-weight: 850;
          letter-spacing: 0.2px;
        }

        .admin-login-brand-caption {
          margin: 4px 0 0;
          color: #dbeafe;
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .admin-login-banner-content {
          margin: 45px 0;
        }

        .admin-login-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.27);
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          color: #eff6ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .admin-login-banner-title {
          margin: 22px 0 14px;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.12;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .admin-login-banner-text {
          max-width: 330px;
          margin: 0;
          color: #eff6ff;
          font-size: 14px;
          line-height: 1.9;
        }

        .admin-login-features {
          display: grid;
          gap: 15px;
          margin-top: 28px;
        }

        .admin-login-feature {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #fff;
          font-size: 13px;
          font-weight: 650;
        }

        .admin-login-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border-radius: 10px;
          background: rgba(255,255,255,0.16);
        }

        .admin-login-banner-footer {
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.22);
          color: #dbeafe;
          font-size: 11px;
          line-height: 1.7;
        }

        .admin-login-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 35px;
          background: var(--surface);
        }

        .admin-login-form-content {
          width: 100%;
          max-width: 340px;
        }

        .admin-login-mobile-brand {
          display: none;
        }

        .admin-login-form-eyebrow {
          margin: 0 0 10px;
          color: var(--primary);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .admin-login-form-title {
          margin: 0;
          color: var(--text);
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .admin-login-form-description {
          margin: 11px 0 30px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .admin-login-field {
          margin-bottom: 21px;
        }

        .admin-login-label {
          display: block;
          margin-bottom: 9px;
          color: var(--text);
          font-size: 12px;
          font-weight: 800;
        }

        .admin-login-input-wrap {
          position: relative;
        }

        .admin-login-input-icon {
          position: absolute;
          top: 50%;
          left: 14px;
          transform: translateY(-50%);
          font-size: 16px;
          pointer-events: none;
        }

        .admin-login-input {
          box-sizing: border-box;
          width: 100%;
          min-height: 48px;
          padding: 12px 14px 12px 43px;
          border: 1px solid var(--border);
          border-radius: 12px;
          outline: none;
          background: var(--input-bg);
          color: var(--text);
          font-family: inherit;
          font-size: 13px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .admin-login-input::placeholder {
          color: var(--muted);
          opacity: 0.8;
        }

        .admin-login-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.13);
        }

        .admin-login-password-input {
          padding-right: 76px;
        }

        .admin-login-show-password {
          position: absolute;
          top: 50%;
          right: 11px;
          transform: translateY(-50%);
          padding: 6px;
          border: none;
          background: transparent;
          color: var(--primary);
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .admin-login-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 18px;
          padding: 12px 13px;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: var(--danger-bg, #fee2e2);
          color: var(--danger-text, #991b1b);
          font-size: 12px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .admin-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 49px;
          margin-top: 8px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(100deg, #2563eb, #1d4ed8);
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(37,99,235,0.2);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }

        .admin-login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 11px 24px rgba(37,99,235,0.28);
        }

        .admin-login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .admin-login-spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: admin-login-spin 0.8s linear infinite;
        }

        @keyframes admin-login-spin {
          to { transform: rotate(360deg); }
        }

        .admin-login-security-note {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 25px;
          padding: 13px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface-soft);
          color: var(--muted);
          font-size: 11px;
          line-height: 1.7;
        }

        .admin-login-security-note strong {
          color: var(--text);
        }

        @media (max-width: 700px) {
          .admin-login-page {
            min-height: auto;
            padding: 22px 14px 35px;
          }

          .admin-login-layout {
            grid-template-columns: 1fr;
            max-width: 440px;
            min-height: auto;
            border-radius: 21px;
          }

          .admin-login-banner {
            display: none;
          }

          .admin-login-form-panel {
            padding: 30px 23px;
          }

          .admin-login-mobile-brand {
            display: flex;
            align-items: center;
            gap: 11px;
            margin-bottom: 30px;
          }

          .admin-login-mobile-brand-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            border-radius: 14px;
            background: linear-gradient(135deg, #2563eb, #dc2626);
            color: #fff;
            font-size: 23px;
          }

          .admin-login-form-title {
            font-size: 27px;
          }

          .admin-login-form-description {
            margin-bottom: 24px;
          }
        }
      `}</style>

      <section className="admin-login-layout">
        <aside className="admin-login-banner">
          <div className="admin-login-brand">
            <div className="admin-login-brand-icon">🍽️</div>
            <div>
              <p className="admin-login-brand-name">Campus Canteen</p>
              <p className="admin-login-brand-caption">Pre-Order System</p>
            </div>
          </div>

          <div className="admin-login-banner-content">
            <div className="admin-login-badge">
              <span>🛡️</span>
              Secure Admin Portal
            </div>

            <h1 className="admin-login-banner-title">
              Manage your
              <br />
              canteen smarter.
            </h1>

            <p className="admin-login-banner-text">
              Access your administration dashboard to manage tokens, orders,
              menu availability and student accounts in one place.
            </p>

            <div className="admin-login-features">
              <div className="admin-login-feature">
                <span className="admin-login-feature-icon">🎫</span>
                Token and order management
              </div>

              <div className="admin-login-feature">
                <span className="admin-login-feature-icon">🍱</span>
                Canteen menu administration
              </div>

              <div className="admin-login-feature">
                <span className="admin-login-feature-icon">🎓</span>
                Student account management
              </div>
            </div>
          </div>

          <div className="admin-login-banner-footer">
            Authorized administrators only.
            <br />
            Campus Canteen Pre-Order System
          </div>
        </aside>

        <div className="admin-login-form-panel">
          <div className="admin-login-form-content">
            <div className="admin-login-mobile-brand">
              <div className="admin-login-mobile-brand-icon">🍽️</div>
              <div>
                <p className="admin-login-brand-name">
                  Campus Canteen
                </p>
                <p className="admin-login-brand-caption" style={{ color: "var(--muted)" }}>
                  Pre-Order System
                </p>
              </div>
            </div>

            <p className="admin-login-form-eyebrow">
              Welcome back, Admin
            </p>

            <h2 className="admin-login-form-title">Sign in</h2>

            <p className="admin-login-form-description">
              Enter your administrator credentials to access the dashboard.
            </p>

            <form onSubmit={submit}>
              <div className="admin-login-field">
                <label className="admin-login-label" htmlFor="admin-username">
                  Username
                </label>

                <div className="admin-login-input-wrap">
                  <span className="admin-login-input-icon">👤</span>
                  <input
                    id="admin-username"
                    className="admin-login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    autoComplete="username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="admin-login-field">
                <label className="admin-login-label" htmlFor="admin-password">
                  Password
                </label>

                <div className="admin-login-input-wrap">
                  <span className="admin-login-input-icon">🔑</span>
                  <input
                    id="admin-password"
                    className="admin-login-input admin-login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />

                  <button
                    className="admin-login-show-password"
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="admin-login-error" role="alert">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                className="admin-login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="admin-login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in securely
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="admin-login-security-note">
              <span>🔒</span>
              <span>
                <strong>Secure access</strong>
                <br />
                Your administrator credentials are used to authenticate your
                session.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
