
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE, getErrorMessage } from "../api";
import { formatDateTime } from "../format";

const STATUS_INFO = {
  PLACED: {
    label: "Order Placed",
    color: "#f0ad4e",
    background: "var(--warning-bg, var(--surface-soft))",
    icon: "🕒",
  },
  TOKEN_ISSUED: {
    label: "Token Issued",
    color: "#2a9fd6",
    background: "var(--surface-soft)",
    icon: "🎟️",
  },
  COLLECTED: {
    label: "Food Collected",
    color: "var(--success-text)",
    background: "var(--success-bg)",
    icon: "✅",
  },
  NO_SHOW: {
    label: "Not Collected",
    color: "var(--danger-text)",
    background: "var(--danger-bg)",
    icon: "⚠️",
  },
};

function StatusBox({ order, student }) {
  const boxStyle = {
    marginTop: 18,
    padding: 17,
    borderRadius: 12,
    background: STATUS_INFO[order.status]?.background || "var(--surface-soft)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 13,
    lineHeight: 1.8,
  };

  if (order.status === "PLACED") {
    return (
      <div style={boxStyle}>
        <strong style={{ fontSize: 14 }}>
          💳 Next step: Pay at the canteen counter
        </strong>
        <ol style={{ margin: "10px 0 0", paddingLeft: 21 }}>
          <li>Go to the canteen counter.</li>
          <li>
            Tell your application number:{" "}
            <strong>{student.applicationNumber}</strong>
          </li>
          <li>
            Pay <strong>₹{order.totalAmount}</strong> and collect your token.
          </li>
        </ol>
      </div>
    );
  }

  if (order.status === "TOKEN_ISSUED") {
    return (
      <div
        style={{
          ...boxStyle,
          textAlign: "center",
          borderColor: "var(--primary)",
        }}
      >
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          YOUR PICKUP TOKEN
        </div>

        <div
          style={{
            fontSize: "clamp(36px, 8vw, 48px)",
            fontWeight: 800,
            letterSpacing: 4,
            color: "var(--primary)",
            margin: "8px 0",
            overflowWrap: "anywhere",
          }}
        >
          {order.tokenNumber}
        </div>

        <p style={{ margin: 0 }}>
          Show this token at the canteen counter to collect your food.
        </p>
      </div>
    );
  }

  if (order.status === "COLLECTED") {
    return (
      <div
        style={{
          ...boxStyle,
          background: "var(--success-bg)",
          color: "var(--success-text)",
        }}
      >
        <strong>✅ Food collected successfully!</strong>
        <div>Thanks for ordering with CampusBite.</div>
      </div>
    );
  }

  if (order.status === "NO_SHOW") {
    return (
      <div
        style={{
          ...boxStyle,
          background: "var(--danger-bg)",
          color: "var(--danger-text)",
        }}
      >
        <strong>⚠️ This order was not collected.</strong>
        <p style={{ margin: "7px 0 0" }}>
          If 2 orders are not collected, ordering is blocked for 1 week.
        </p>
      </div>
    );
  }

  return null;
}

function OrderCard({ order, student }) {
  const info = STATUS_INFO[order.status] || {
    label: order.status,
    color: "var(--muted)",
    icon: "📦",
  };

  return (
    <article
      style={{
        background: "var(--surface)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: 17,
        padding: "clamp(17px, 4vw, 25px)",
        marginBottom: 20,
        boxShadow: "var(--shadow)",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              color: "var(--muted)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            ORDER NUMBER
          </div>
          <h3 style={{ fontSize: 23, margin: "5px 0 0" }}>
            #{order.id}
          </h3>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 11px",
            borderRadius: 9,
            background: info.background || "var(--surface-soft)",
            color: info.color,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {info.icon} {info.label}
        </span>
      </div>

      <div
        style={{
          marginTop: 22,
          padding: "14px 0",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          ORDER ITEMS
        </div>

        {order.items.map((item, index) => (
          <div
            key={`${order.id}-${index}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 15,
              marginBottom: index === order.items.length - 1 ? 0 : 12,
              fontSize: 14,
            }}
          >
            <span style={{ overflowWrap: "anywhere" }}>
              <span style={{ marginRight: 8 }}>🍽️</span>
              {item.name}{" "}
              <span style={{ color: "var(--muted)" }}>
                × {item.quantity}
              </span>
            </span>
            <strong style={{ whiteSpace: "nowrap" }}>
              ₹{item.subtotal}
            </strong>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginTop: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            TOTAL AMOUNT
          </div>
          <strong
            style={{
              display: "block",
              fontSize: 25,
              color: "var(--primary)",
              marginTop: 3,
            }}
          >
            ₹{order.totalAmount}
          </strong>
        </div>

        <div style={{ textAlign: "right", maxWidth: "60%" }}>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            PICKUP DEADLINE
          </div>
          <strong
            style={{
              display: "block",
              fontSize: 13,
              marginTop: 5,
              overflowWrap: "anywhere",
            }}
          >
            🕧 {formatDateTime(order.pickupTime)}
          </strong>
        </div>
      </div>

      <StatusBox order={order} student={student} />
    </article>
  );
}

export default function MyOrdersPage({ student }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(() => {
    axios
      .get(`${API_BASE}/orders/student/${student.id}`)
      .then((res) => {
        setOrders(res.data);
        setError("");
        setLastUpdated(new Date());
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [student.id]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--page-bg)",
        color: "var(--text)",
        fontFamily: "Inter, sans-serif",
        padding: "30px 5%",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 23,
              letterSpacing: "-0.8px",
            }}
          >
            🍱 Campus<span style={{ color: "var(--primary)" }}>Bite</span>
          </Link>

          <Link
            to="/order"
            style={{
              padding: "11px 15px",
              borderRadius: 9,
              background: "var(--primary)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            + Order Food
          </Link>
        </nav>

        <section
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "clamp(22px, 5vw, 36px)",
            marginBottom: 27,
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "var(--surface-soft)",
              color: "var(--primary)",
              padding: "7px 11px",
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.2,
            }}
          >
            STUDENT DASHBOARD
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 43px)",
              letterSpacing: "-1.5px",
              margin: "17px 0 8px",
            }}
          >
            My Orders <span>🎟️</span>
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Hi {student.name}! Track your food orders, check your token
            and view your pickup details here.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 23,
              paddingTop: 18,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Application No.{" "}
              <strong style={{ color: "var(--text)" }}>
                {student.applicationNumber}
              </strong>

              {lastUpdated && (
                <div style={{ marginTop: 7 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      background: "var(--success-text)",
                      borderRadius: "50%",
                      marginRight: 6,
                    }}
                  />
                  Auto-updating every 10 seconds
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={load}
              style={{
                padding: "10px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--surface-soft)",
                color: "var(--text)",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              ↻ Refresh Orders
            </button>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontSize: 21, margin: 0 }}>Order History</h2>

          {!loading && !error && (
            <span
              style={{
                padding: "7px 11px",
                background: "var(--surface-soft)",
                borderRadius: 8,
                color: "var(--muted)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {loading && (
          <div
            style={{
              padding: 35,
              textAlign: "center",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 15,
            }}
          >
            <div style={{ fontSize: 38 }}>🍱</div>
            <p style={{ fontWeight: 700 }}>Loading your orders...</p>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              Please wait a moment.
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              padding: 18,
              borderRadius: 12,
              background: "var(--danger-bg)",
              color: "var(--danger-text)",
              border: "1px solid var(--border)",
              fontSize: 14,
            }}
          >
            ❌ {error}
            <div>
              <button
                type="button"
                onClick={load}
                style={{
                  marginTop: 12,
                  padding: "9px 13px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 22px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 17,
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ fontSize: 55 }}>🍽️</div>
            <h3 style={{ fontSize: 21 }}>No orders yet</h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 360,
                margin: "0 auto 22px",
              }}
            >
              Your canteen orders will appear here. Ready for your first
              CampusBite meal?
            </p>
            <Link
              to="/order"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 10,
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Explore Menu →
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              student={student}
            />
          ))}

        <footer
          style={{
            textAlign: "center",
            padding: "25px 10px 10px",
            color: "var(--muted)",
            fontSize: 12,
          }}
        >
          CampusBite · Made for campus life 🍱
        </footer>
      </div>
    </div>
  );
}
