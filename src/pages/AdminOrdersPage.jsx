
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, getErrorMessage } from "../api";
import { adminHeaders, getAdminToken, clearAdminToken } from "../adminAuth";
import { formatDateTime } from "../format";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const navigate = useNavigate();

  const loadOrders = () => {
    setLoading(true);
    setError("");

    axios
      .get(`${API_BASE}/admin/orders`, { headers: adminHeaders() })
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statuses = useMemo(
    () => [...new Set(orders.map((order) => order.status).filter(Boolean))],
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "ALL" || order.status === selectedStatus;

      const items = Array.isArray(order.items)
        ? order.items.map((item) => item.name).join(" ")
        : "";

      const searchableText = [
        order.id,
        order.tokenNumber,
        order.studentName,
        order.department,
        order.applicationNumber,
        order.status,
        items,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [orders, search, selectedStatus]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.totalAmount) || 0),
    0
  );

  const statusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value.includes("complete") || value.includes("collected")) {
      return "order-status-complete";
    }

    if (value.includes("cancel") || value.includes("reject")) {
      return "order-status-cancelled";
    }

    if (value.includes("ready")) {
      return "order-status-ready";
    }

    if (value.includes("prepar")) {
      return "order-status-preparing";
    }

    return "order-status-pending";
  };

  return (
    <main className="admin-orders-page">
      <style>{`
        .admin-orders-page {
          max-width: 1450px;
          margin: 0 auto;
          padding: 32px 22px 55px;
          color: var(--text);
        }
        .admin-orders-page * { box-sizing: border-box; }
        .orders-hero {
          padding: 30px;
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          color: white;
          background: linear-gradient(115deg, #1e40af, #2563eb 65%, #dc2626);
          box-shadow: 0 12px 32px rgba(37, 99, 235, .2);
          margin-bottom: 24px;
        }
        .orders-hero h1 {
          font-size: clamp(25px, 4vw, 34px);
          margin: 0 0 10px;
        }
        .orders-hero p {
          margin: 0;
          color: #eff6ff;
          line-height: 1.7;
        }
        .orders-hero-icon {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 76px;
          opacity: .22;
        }
        .orders-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .orders-stat {
          padding: 21px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--shadow);
          min-width: 0;
        }
        .orders-stat-icon { font-size: 23px; margin-bottom: 12px; }
        .orders-stat-label {
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .05em;
        }
        .orders-stat-value {
          margin-top: 8px;
          font-size: 29px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }
        .orders-panel {
          padding: 24px;
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 18px;
          box-shadow: var(--shadow);
        }
        .orders-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 20px;
        }
        .orders-panel-heading h2 { margin: 0 0 6px; font-size: 21px; }
        .orders-muted { color: var(--muted); font-size: 13px; }
        .orders-refresh {
          padding: 10px 15px;
          border-radius: 9px;
          border: 1px solid var(--border);
          background: var(--surface-soft);
          color: var(--text);
          font-weight: 700;
          cursor: pointer;
        }
        .orders-refresh:disabled { opacity: .6; cursor: wait; }
        .orders-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .orders-search {
          flex: 1;
          min-width: 220px;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--input-bg);
          color: var(--text);
          outline-color: var(--primary);
        }
        .orders-filter {
          padding: 11px 12px;
          min-width: 155px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--input-bg);
          color: var(--text);
        }
        .orders-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .orders-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
          text-align: left;
        }
        .orders-table th {
          padding: 14px 13px;
          background: var(--table-head);
          color: var(--muted);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: .05em;
          white-space: nowrap;
        }
        .orders-table td {
          padding: 15px 13px;
          border-bottom: 1px solid var(--border);
          color: var(--text);
          font-size: 13px;
          vertical-align: top;
        }
        .orders-table tbody tr:last-child td { border-bottom: none; }
        .orders-table tbody tr:hover { background: var(--surface-soft); }
        .orders-id {
          color: var(--primary);
          font-weight: 800;
          white-space: nowrap;
        }
        .orders-token {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 8px;
          background: var(--surface-soft);
          color: var(--primary);
          font-weight: 800;
          white-space: nowrap;
        }
        .orders-student { font-weight: 700; margin-bottom: 5px; }
        .orders-subtext { color: var(--muted); font-size: 12px; }
        .orders-items { max-width: 220px; line-height: 1.8; }
        .orders-total { font-weight: 800; white-space: nowrap; }
        .order-status {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }
        .order-status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .order-status-preparing {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .order-status-ready {
          background: #ffedd5;
          color: #9a3412;
        }
        .order-status-complete {
          background: #dcfce7;
          color: #166534;
        }
        .order-status-cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }
        [data-theme="dark"] .order-status-pending {
          background: #422006; color: #fde68a;
        }
        [data-theme="dark"] .order-status-preparing {
          background: #172554; color: #93c5fd;
        }
        [data-theme="dark"] .order-status-ready {
          background: #431407; color: #fdba74;
        }
        [data-theme="dark"] .order-status-complete {
          background: #052e16; color: #86efac;
        }
        [data-theme="dark"] .order-status-cancelled {
          background: #450a0a; color: #fca5a5;
        }
        .orders-alert {
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
        }
        .orders-error {
          background: var(--danger-bg);
          color: var(--danger-text);
        }
        .orders-empty {
          padding: 42px 20px;
          text-align: center;
          background: var(--surface-soft);
          color: var(--muted);
          border-radius: 12px;
        }
        .orders-empty-icon { font-size: 40px; margin-bottom: 12px; }
        @media (max-width: 700px) {
          .admin-orders-page { padding: 20px 13px 40px; }
          .orders-hero { padding: 25px 20px; }
          .orders-hero-icon { right: 12px; font-size: 48px; }
          .orders-stats { grid-template-columns: 1fr; gap: 10px; }
          .orders-stat { padding: 16px; }
          .orders-stat-value { font-size: 25px; }
          .orders-panel { padding: 16px; }
          .orders-controls { align-items: stretch; }
          .orders-search, .orders-filter { width: 100%; min-width: 0; }
        }
      `}</style>

      <header className="orders-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>
            CANTEEN ADMINISTRATION
          </div>
          <h1>Order Management</h1>
          <p>View student orders, pickup schedules, tokens, and order statuses.</p>
        </div>
        <div className="orders-hero-icon" aria-hidden="true">🧾</div>
      </header>

      {error && (
        <div className="orders-alert orders-error" role="alert">
          ⚠ {error}
        </div>
      )}

      <section className="orders-stats">
        <div className="orders-stat">
          <div className="orders-stat-icon">📦</div>
          <div className="orders-stat-label">TOTAL ORDERS</div>
          <div className="orders-stat-value">{orders.length}</div>
        </div>

        <div className="orders-stat">
          <div className="orders-stat-icon">💰</div>
          <div className="orders-stat-label">TOTAL ORDER VALUE</div>
          <div className="orders-stat-value" style={{ color: "var(--primary)" }}>
            ₹{totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="orders-stat">
          <div className="orders-stat-icon">🔍</div>
          <div className="orders-stat-label">MATCHING ORDERS</div>
          <div className="orders-stat-value" style={{ color: "var(--accent)" }}>
            {filteredOrders.length}
          </div>
        </div>
      </section>

      <section className="orders-panel">
        <div className="orders-panel-heading">
          <div>
            <h2>All Orders</h2>
            <div className="orders-muted">
              Search and review orders placed by students.
            </div>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="orders-refresh"
          >
            {loading ? "⏳ Loading..." : "↻ Refresh Orders"}
          </button>
        </div>

        <div className="orders-controls">
          <input
            className="orders-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="🔎 Search order, token, student, department..."
            aria-label="Search orders"
          />

          <select
            className="orders-filter"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            aria-label="Filter by order status"
          >
            <option value="ALL">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading && orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">⏳</div>
            Loading orders...
          </div>
        ) : error && orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">⚠️</div>
            Orders could not be loaded. Check the error message above.
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">📭</div>
            <strong>{orders.length === 0 ? "No orders yet" : "No matching orders"}</strong>
            <p style={{ marginBottom: 0 }}>
              {orders.length === 0
                ? "Student orders will appear here."
                : "Try another search term or select a different status."}
            </p>
          </div>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Token</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>App No</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Pickup Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="orders-id">#{order.id}</span>
                    </td>
                    <td>
                      <span className="orders-token">
                        {order.tokenNumber || "-"}
                      </span>
                    </td>
                    <td>
                      <div className="orders-student">{order.studentName || "-"}</div>
                    </td>
                    <td>{order.department || "-"}</td>
                    <td>{order.applicationNumber || "-"}</td>
                    <td>
                      <div className="orders-items">
                        {Array.isArray(order.items) && order.items.length > 0
                          ? order.items
                              .map((item) => `${item.name} × ${item.quantity}`)
                              .join(", ")
                          : "-"}
                      </div>
                    </td>
                    <td className="orders-total">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ minWidth: 145 }}>
                      {formatDateTime(order.pickupTime)}
                    </td>
                    <td>
                      <span className={`order-status ${statusClass(order.status)}`}>
                        {order.status || "UNKNOWN"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="orders-muted" style={{ marginTop: 14 }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </section>
    </main>
  );
}
