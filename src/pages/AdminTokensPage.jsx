
import { useEffect, useState } from "react";
import { adminHeaders } from "../adminAuth";

import { API_BASE } from "../api";

const API = `${API_BASE}/admin/tokens`;

export default function AdminTokensPage() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [searchOrders, setSearchOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [collectedOrders, setCollectedOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...adminHeaders(),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  }

  async function refreshLists() {
    const [pending, collected] = await Promise.all([
      apiRequest(`${API}/uncollected`),
      apiRequest(`${API}/collected`),
    ]);

    setPendingOrders(pending);
    setCollectedOrders(collected);
  }

  async function loadInitialLists() {
    setLoading(true);
    setError("");

    try {
      await refreshLists();
    } catch (e) {
      setError(e.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitialLists();
  }, []);

  async function searchStudentOrders(e) {
    e.preventDefault();

    if (!applicationNumber.trim()) {
      setError("Please enter a student application number.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setSearchOrders([]);

    try {
      const data = await apiRequest(
        `${API}/search?applicationNumber=${encodeURIComponent(applicationNumber.trim())}`
      );

      setSearchOrders(Array.isArray(data) ? data : []);

      if (!Array.isArray(data) || data.length === 0) {
        setMessage("No orders found for this student.");
      }
    } catch (e) {
      setError(e.message || "Unable to search student orders.");
    } finally {
      setLoading(false);
    }
  }

  async function issueToken(orderId) {
    if (
      !window.confirm(
        `Confirm that payment has been received for Order #${orderId} and issue the token?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest(`${API}/issue/${orderId}`, {
        method: "POST",
      });

      setMessage(data.message || "Token issued successfully.");
      await refreshLists();

      if (applicationNumber.trim()) {
        const searched = await apiRequest(
          `${API}/search?applicationNumber=${encodeURIComponent(applicationNumber.trim())}`
        );
        setSearchOrders(Array.isArray(searched) ? searched : []);
      }
    } catch (e) {
      setError(e.message || "Unable to issue the token.");
    } finally {
      setLoading(false);
    }
  }

  async function markCollected(order) {
    if (order.status !== "TOKEN_ISSUED") {
      setError("A token must be issued after payment before food can be collected.");
      return;
    }

    if (
      !window.confirm(
        `Student: ${order.studentName}\nOrder: #${order.id}\n\nConfirm that the food has been handed over to the student?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest(`${API}/collect-order/${order.id}`, {
        method: "POST",
      });

      setMessage(data.message || "Food collection recorded successfully.");
      await refreshLists();

      if (applicationNumber.trim()) {
        const searched = await apiRequest(
          `${API}/search?applicationNumber=${encodeURIComponent(applicationNumber.trim())}`
        );
        setSearchOrders(Array.isArray(searched) ? searched : []);
      }
    } catch (e) {
      setError(e.message || "Unable to confirm food collection.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
  }

  function getStatusClass(status) {
    if (status === "TOKEN_ISSUED") return "token-status-issued";
    if (status === "COLLECTED") return "token-status-collected";
    if (status === "PLACED") return "token-status-pending";

    const value = String(status || "").toLowerCase();

    if (value.includes("cancel")) return "token-status-cancelled";
    if (value.includes("collect") || value.includes("complete")) {
      return "token-status-collected";
    }

    return "token-status-pending";
  }

  function ordersTable(orders, showAction = false) {
    if (orders.length === 0) {
      return (
        <div className="token-empty">
          <div className="token-empty-icon">📭</div>
          <strong>No orders found</strong>
          <p>Orders will appear here when available.</p>
        </div>
      );
    }

    return (
      <div className="token-table-wrap">
        <table className="token-table">
          <thead>
            <tr>
              {[
                "Order ID",
                "Student Name",
                "Application Number",
                "Pickup Time",
                "Total Amount",
                "Token Number",
                "Order Status",
                ...(showAction ? ["Action"] : []),
              ].map((heading) => (
                <th key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="token-order-id">#{order.id}</span>
                </td>

                <td>
                  <span className="token-student-name">
                    {order.studentName || "-"}
                  </span>
                </td>

                <td>{order.applicationNumber || "-"}</td>

                <td style={{ whiteSpace: "nowrap" }}>
                  {formatDate(order.pickupTime)}
                </td>

                <td className="token-amount">
                  ₹{Number(order.totalAmount ?? 0).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td>
                  <span className="token-number">
                    {order.tokenNumber || "Not issued"}
                  </span>
                </td>

                <td>
                  <span className={`token-status ${getStatusClass(order.status)}`}>
                    {order.status || "UNKNOWN"}
                  </span>
                </td>

                {showAction && (
                  <td style={{ whiteSpace: "nowrap" }}>
                    {order.status === "PLACED" && (
                      <button
                        className="token-action token-issue"
                        onClick={() => issueToken(order.id)}
                        disabled={loading}
                      >
                        🎟️ Issue Token
                      </button>
                    )}

                    {order.status === "TOKEN_ISSUED" && (
                      <button
                        className="token-action token-collect"
                        onClick={() => markCollected(order)}
                        disabled={loading}
                      >
                        ✓ Confirm Collection
                      </button>
                    )}

                    {order.status !== "PLACED" &&
                      order.status !== "TOKEN_ISSUED" && (
                        <span className="token-muted">No action needed</span>
                      )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className="admin-token-page">
      <style>{`
        .admin-token-page {
          max-width: 1450px;
          margin: 0 auto;
          padding: 32px 22px 55px;
          color: var(--text);
        }
        .admin-token-page * { box-sizing: border-box; }
        .token-hero {
          position: relative;
          overflow: hidden;
          padding: 31px;
          margin-bottom: 24px;
          border-radius: 22px;
          color: white;
          background: linear-gradient(115deg, #1e40af, #2563eb 65%, #dc2626);
          box-shadow: 0 12px 32px rgba(37, 99, 235, .2);
        }
        .token-hero h1 {
          margin: 0 0 10px;
          font-size: clamp(25px, 4vw, 34px);
        }
        .token-hero p { color: #eff6ff; margin: 0; line-height: 1.7; }
        .token-hero-icon {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 76px;
          opacity: .23;
        }
        .token-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 25px;
        }
        .token-stat {
          padding: 21px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }
        .token-stat-icon { font-size: 23px; margin-bottom: 12px; }
        .token-stat-label {
          font-size: 12px;
          color: var(--muted);
          font-weight: 800;
          letter-spacing: .05em;
        }
        .token-stat-value { margin-top: 8px; font-size: 29px; font-weight: 800; }
        .token-panel {
          padding: 24px;
          margin-bottom: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: var(--shadow);
        }
        .token-panel-heading {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 20px;
        }
        .token-panel-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: var(--surface-soft);
          font-size: 22px;
        }
        .token-panel-heading h2 { margin: 0 0 5px; font-size: 20px; }
        .token-muted { color: var(--muted); font-size: 12px; }
        .token-search-form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .token-search-input {
          flex: 1;
          min-width: 230px;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--input-bg);
          color: var(--text);
        }
        .token-primary-btn {
          padding: 12px 18px;
          border: none;
          border-radius: 9px;
          background: var(--primary);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
        .token-primary-btn:disabled, .token-action:disabled {
          opacity: .55;
          cursor: wait;
        }
        .token-refresh {
          padding: 11px 16px;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: var(--surface-soft);
          color: var(--text);
          font-weight: 700;
          cursor: pointer;
        }
        .token-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .token-table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
          text-align: left;
        }
        .token-table th {
          padding: 14px 13px;
          background: var(--table-head);
          color: var(--muted);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .04em;
          white-space: nowrap;
        }
        .token-table td {
          padding: 15px 13px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
          color: var(--text);
          vertical-align: middle;
        }
        .token-table tbody tr:last-child td { border-bottom: none; }
        .token-table tbody tr:hover { background: var(--surface-soft); }
        .token-order-id { color: var(--primary); font-weight: 800; }
        .token-student-name { font-weight: 700; }
        .token-amount { font-weight: 800; white-space: nowrap; }
        .token-number {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 8px;
          background: var(--surface-soft);
          color: var(--primary);
          font-weight: 800;
          white-space: nowrap;
        }
        .token-status {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }
        .token-status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .token-status-issued {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .token-status-collected {
          background: #dcfce7;
          color: #166534;
        }
        .token-status-cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }
        [data-theme="dark"] .token-status-pending {
          background: #422006; color: #fde68a;
        }
        [data-theme="dark"] .token-status-issued {
          background: #172554; color: #93c5fd;
        }
        [data-theme="dark"] .token-status-collected {
          background: #052e16; color: #86efac;
        }
        [data-theme="dark"] .token-status-cancelled {
          background: #450a0a; color: #fca5a5;
        }
        .token-action {
          padding: 9px 11px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .token-issue { background: var(--primary); color: white; }
        .token-collect { background: var(--accent); color: white; }
        .token-alert {
          padding: 14px 16px;
          margin-bottom: 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
        }
        .token-alert.success { background: var(--success-bg); color: var(--success-text); }
        .token-alert.error { background: var(--danger-bg); color: var(--danger-text); }
        .token-empty {
          padding: 34px 20px;
          text-align: center;
          border-radius: 12px;
          background: var(--surface-soft);
          color: var(--muted);
        }
        .token-empty-icon { font-size: 38px; margin-bottom: 10px; }
        .token-empty p { margin-bottom: 0; font-size: 13px; }
        .token-section-note { margin: -8px 0 18px; color: var(--muted); font-size: 13px; line-height: 1.7; }
        @media (max-width: 700px) {
          .admin-token-page { padding: 20px 13px 40px; }
          .token-hero { padding: 25px 20px; }
          .token-hero-icon { right: 12px; font-size: 48px; }
          .token-stats { grid-template-columns: 1fr; gap: 10px; }
          .token-stat { padding: 16px; }
          .token-stat-value { font-size: 25px; }
          .token-panel { padding: 16px; }
          .token-search-input { min-width: 100%; }
          .token-primary-btn { width: 100%; }
        }
      `}</style>

      <header className="token-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>
            CANTEEN ADMINISTRATION
          </div>
          <h1>Token Counter</h1>
          <p>Search student orders, issue tokens after payment, and confirm food collection.</p>
        </div>
        <div className="token-hero-icon" aria-hidden="true">🎟️</div>
      </header>

      {message && (
        <div className="token-alert success" role="status">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="token-alert error" role="alert">
          ⚠ {error}
        </div>
      )}

      <section className="token-stats">
        <div className="token-stat">
          <div className="token-stat-icon">🔎</div>
          <div className="token-stat-label">SEARCH RESULTS</div>
          <div className="token-stat-value">{searchOrders.length}</div>
        </div>
        <div className="token-stat">
          <div className="token-stat-icon">⏳</div>
          <div className="token-stat-label">AWAITING COLLECTION</div>
          <div className="token-stat-value" style={{ color: "var(--accent)" }}>
            {pendingOrders.length}
          </div>
        </div>
        <div className="token-stat">
          <div className="token-stat-icon">✅</div>
          <div className="token-stat-label">COLLECTED ORDERS</div>
          <div className="token-stat-value" style={{ color: "var(--success-text)" }}>
            {collectedOrders.length}
          </div>
        </div>
      </section>

      <section className="token-panel">
        <div className="token-panel-heading">
          <span className="token-panel-icon">🔍</span>
          <div>
            <h2>1. Search Student Orders</h2>
            <div className="token-muted">Find orders using the student application number.</div>
          </div>
        </div>

        <form onSubmit={searchStudentOrders} className="token-search-form">
          <input
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            placeholder="Enter student application number"
            aria-label="Student application number"
            required
            className="token-search-input"
          />
          <button type="submit" disabled={loading} className="token-primary-btn">
            {loading ? "Searching..." : "Search Orders →"}
          </button>
        </form>

        {loading && searchOrders.length === 0 ? (
          <div className="token-empty">Searching orders...</div>
        ) : (
          ordersTable(searchOrders, true)
        )}
      </section>

      <section className="token-panel">
        <div className="token-panel-heading">
          <span className="token-panel-icon">⏳</span>
          <div>
            <h2>2. Pending Food Collections</h2>
            <div className="token-muted">Review orders awaiting token issuance or collection.</div>
          </div>
        </div>

        <p className="token-section-note">
          Confirm payment before issuing a token. Confirm food handover only after the student receives the order.
        </p>

        {loading && pendingOrders.length === 0 ? (
          <div className="token-empty">Loading pending orders...</div>
        ) : (
          ordersTable(pendingOrders, true)
        )}
      </section>

      <section className="token-panel">
        <div className="token-panel-heading">
          <span className="token-panel-icon">✅</span>
          <div>
            <h2>3. Completed Collections</h2>
            <div className="token-muted">Orders where food collection has been recorded.</div>
          </div>
        </div>

        {loading && collectedOrders.length === 0 ? (
          <div className="token-empty">Loading collected orders...</div>
        ) : (
          ordersTable(collectedOrders)
        )}
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={loadInitialLists}
          disabled={loading}
          className="token-refresh"
        >
          {loading ? "⏳ Refreshing..." : "↻ Refresh All Orders"}
        </button>
      </div>
    </main>
  );
}
