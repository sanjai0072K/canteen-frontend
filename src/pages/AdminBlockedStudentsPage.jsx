
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminHeaders, getAdminToken, clearAdminToken } from "../adminAuth";

import { API_BASE } from "../api";

const API = `${API_BASE}/admin/students`;

export default function AdminBlockedStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function loadBlockedStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/blocked`, {
        headers: adminHeaders(),
      });

      const data = await response.json().catch(() => []);

      if (response.status === 401 || response.status === 403) {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load blocked students."
        );
      }

      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    loadBlockedStudents();
  }, []);

  async function unblockStudent(student) {
    const confirmed = window.confirm(
      `Unblock ${student.name} (${student.applicationNumber})?\n\nThey will be allowed to place orders again.`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${student.id}/unblock`, {
        method: "POST",
        headers: adminHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to unblock student."
        );
      }

      setMessage(data.message || `${student.name} has been unblocked.`);
      await loadBlockedStudents();
    } catch (e) {
      setError(e.message || "Unable to unblock student.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <main className="blocked-page">
      <style>{`
        .blocked-page {
          max-width: 1250px;
          margin: 0 auto;
          padding: 30px 22px 45px;
          color: var(--text);
        }

        .blocked-hero {
          position: relative;
          overflow: hidden;
          padding: 30px;
          border-radius: 24px;
          color: #fff;
          background: linear-gradient(120deg, #1d4ed8 0%, #2563eb 58%, #dc2626 100%);
          box-shadow: 0 14px 35px rgba(37, 99, 235, 0.18);
        }

        .blocked-hero::after {
          content: "";
          position: absolute;
          width: 210px;
          height: 210px;
          right: -55px;
          top: -90px;
          border: 35px solid rgba(255,255,255,0.10);
          border-radius: 50%;
          pointer-events: none;
        }

        .blocked-hero-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .blocked-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #dbeafe;
        }

        .blocked-title {
          margin: 10px 0 8px;
          font-size: clamp(26px, 4vw, 36px);
          line-height: 1.2;
          font-weight: 850;
          letter-spacing: -0.7px;
        }

        .blocked-description {
          max-width: 600px;
          margin: 0;
          color: #eff6ff;
          font-size: 14px;
          line-height: 1.7;
        }

        .blocked-refresh {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 18px;
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 12px;
          background: rgba(255,255,255,0.14);
          color: #fff;
          font-size: 14px;
          font-weight: 750;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .blocked-refresh:hover:not(:disabled) {
          background: rgba(255,255,255,0.24);
          transform: translateY(-1px);
        }

        .blocked-refresh:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .blocked-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin: 22px 0;
        }

        .blocked-stat {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .blocked-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          font-size: 23px;
        }

        .blocked-stat-icon.red {
          color: #dc2626;
          background: #fee2e2;
        }

        .blocked-stat-icon.blue {
          color: #2563eb;
          background: #dbeafe;
        }

        .blocked-stat-icon.green {
          color: #15803d;
          background: #dcfce7;
        }

        .blocked-stat-label {
          margin: 0 0 5px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .blocked-stat-value {
          margin: 0;
          color: var(--text);
          font-size: 25px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .blocked-panel {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .blocked-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding: 21px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-soft);
        }

        .blocked-panel-title {
          margin: 0;
          font-size: 18px;
          font-weight: 850;
          color: var(--text);
        }

        .blocked-panel-subtitle {
          margin: 5px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .blocked-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 38px;
          padding: 7px 12px;
          border-radius: 999px;
          color: #b91c1c;
          background: #fee2e2;
          font-size: 13px;
          font-weight: 850;
        }

        .blocked-alert {
          margin: 18px 0;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .blocked-alert.success {
          color: var(--success-text, #166534);
          background: var(--success-bg, #dcfce7);
          border: 1px solid var(--border);
        }

        .blocked-alert.error {
          color: var(--danger-text, #991b1b);
          background: var(--danger-bg, #fee2e2);
          border: 1px solid var(--border);
        }

        .blocked-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .blocked-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          white-space: nowrap;
        }

        .blocked-table th {
          padding: 15px 18px;
          background: var(--table-head);
          color: var(--muted);
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.65px;
          border-bottom: 1px solid var(--border);
        }

        .blocked-table td {
          padding: 17px 18px;
          border-bottom: 1px solid var(--border);
          color: var(--text);
          font-size: 13px;
        }

        .blocked-table tbody tr {
          transition: background 0.15s;
        }

        .blocked-table tbody tr:hover {
          background: var(--surface-soft);
        }

        .blocked-table tbody tr:last-child td {
          border-bottom: none;
        }

        .blocked-student-name {
          font-weight: 800;
          color: var(--text);
        }

        .blocked-id {
          color: var(--muted);
          font-weight: 750;
        }

        .blocked-app-number {
          display: inline-block;
          padding: 6px 9px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface-soft);
          color: var(--text);
          font-size: 12px;
          font-weight: 750;
        }

        .blocked-date {
          color: var(--muted);
          font-size: 12px;
        }

        .blocked-unblock {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 13px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fff1f2;
          color: #be123c;
          font-size: 12px;
          font-weight: 850;
          cursor: pointer;
          transition: all 0.2s;
        }

        .blocked-unblock:hover:not(:disabled) {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
          transform: translateY(-1px);
        }

        .blocked-unblock:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .blocked-empty {
          padding: 55px 20px;
          text-align: center;
        }

        .blocked-empty-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 66px;
          height: 66px;
          margin: 0 auto 15px;
          border-radius: 20px;
          background: var(--success-bg, #dcfce7);
          font-size: 30px;
        }

        .blocked-empty h3 {
          margin: 0 0 8px;
          color: var(--text);
          font-size: 18px;
        }

        .blocked-empty p {
          max-width: 390px;
          margin: 0 auto;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .blocked-loading {
          padding: 35px 20px;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }

        .blocked-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 9px;
          vertical-align: middle;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: blocked-spin 0.8s linear infinite;
        }

        @keyframes blocked-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 760px) {
          .blocked-page {
            padding: 20px 13px 32px;
          }

          .blocked-hero {
            padding: 23px 20px;
            border-radius: 19px;
          }

          .blocked-hero-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .blocked-refresh {
            width: 100%;
          }

          .blocked-stats {
            grid-template-columns: 1fr;
            gap: 11px;
            margin: 16px 0;
          }

          .blocked-stat {
            padding: 15px;
          }

          .blocked-stat-icon {
            width: 43px;
            height: 43px;
          }

          .blocked-stat-value {
            font-size: 22px;
          }

          .blocked-panel-header {
            padding: 17px;
          }

          .blocked-table th,
          .blocked-table td {
            padding: 13px 14px;
          }
        }

        :root[data-theme="dark"] .blocked-stat-icon.red {
          color: #fca5a5;
          background: #451a24;
        }

        :root[data-theme="dark"] .blocked-stat-icon.blue {
          color: #93c5fd;
          background: #172554;
        }

        :root[data-theme="dark"] .blocked-stat-icon.green {
          color: #86efac;
          background: #14532d;
        }

        :root[data-theme="dark"] .blocked-count {
          color: #fca5a5;
          background: #451a24;
        }

        :root[data-theme="dark"] .blocked-unblock {
          color: #fca5a5;
          background: #451a24;
          border-color: #7f1d1d;
        }

        :root[data-theme="dark"] .blocked-unblock:hover:not(:disabled) {
          color: #fff;
          background: #b91c1c;
          border-color: #b91c1c;
        }
      `}</style>

      <section className="blocked-hero">
        <div className="blocked-hero-top">
          <div>
            <div className="blocked-eyebrow">
              <span>🛡️</span>
              ADMINISTRATION / STUDENT CONTROL
            </div>

            <h1 className="blocked-title">Blocked Students</h1>

            <p className="blocked-description">
              Manage student ordering restrictions. Review blocked accounts
              and restore their ability to place canteen pre-orders.
            </p>
          </div>

          <button
            className="blocked-refresh"
            onClick={loadBlockedStudents}
            disabled={loading}
          >
            <span>{loading ? "⏳" : "↻"}</span>
            {loading ? "Loading..." : "Refresh Students"}
          </button>
        </div>
      </section>

      <section className="blocked-stats">
        <div className="blocked-stat">
          <div className="blocked-stat-icon red">🚫</div>
          <div>
            <p className="blocked-stat-label">Currently Blocked</p>
            <p className="blocked-stat-value">{students.length}</p>
          </div>
        </div>

        <div className="blocked-stat">
          <div className="blocked-stat-icon blue">🎓</div>
          <div>
            <p className="blocked-stat-label">Departments</p>
            <p className="blocked-stat-value">
              {new Set(
                students
                  .map((student) => student.department)
                  .filter(Boolean)
              ).size}
            </p>
          </div>
        </div>

        <div className="blocked-stat">
          <div className="blocked-stat-icon green">🔓</div>
          <div>
            <p className="blocked-stat-label">Unblock Action</p>
            <p className="blocked-stat-value">Available</p>
          </div>
        </div>
      </section>

      {message && (
        <div className="blocked-alert success" role="status">
          <strong>✓ Success: </strong>
          {message}
        </div>
      )}

      {error && (
        <div className="blocked-alert error" role="alert">
          <strong>⚠ Error: </strong>
          {error}
        </div>
      )}

      <section className="blocked-panel">
        <div className="blocked-panel-header">
          <div>
            <h2 className="blocked-panel-title">Student Restrictions</h2>
            <p className="blocked-panel-subtitle">
              Review account details and remove restrictions when appropriate.
            </p>
          </div>

          <span className="blocked-count">
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </span>
        </div>

        {loading && (
          <div className="blocked-loading" role="status">
            <span className="blocked-spinner" />
            Loading blocked students...
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="blocked-empty">
            <div className="blocked-empty-icon">✓</div>
            <h3>No blocked students</h3>
            <p>
              All student accounts are currently clear of ordering restrictions.
              There are no blocked students to display.
            </p>
          </div>
        )}

        {!loading && students.length > 0 && (
          <div className="blocked-table-wrap">
            <table className="blocked-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Details</th>
                  <th>Application Number</th>
                  <th>Department</th>
                  <th>College</th>
                  <th>Blocked Until</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="blocked-id">#{student.id}</span>
                    </td>

                    <td>
                      <span className="blocked-student-name">
                        {student.name || "-"}
                      </span>
                    </td>

                    <td>
                      <span className="blocked-app-number">
                        {student.applicationNumber || "-"}
                      </span>
                    </td>

                    <td>{student.department || "-"}</td>

                    <td>{student.collegeName || "-"}</td>

                    <td>
                      <span className="blocked-date">
                        {formatDate(student.blockedUntil)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="blocked-unblock"
                        onClick={() => unblockStudent(student)}
                        disabled={loading}
                      >
                        <span>🔓</span>
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
