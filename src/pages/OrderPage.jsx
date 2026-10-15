
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { prettifyDates } from "../format";
import { API_BASE } from "../api";

const COLLECT_BY = { hour: 12, minute: 30 };
const MIN_HOURS_BEFORE = 3;

const DAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const pad = (n) => String(n).padStart(2, "0");

const formatDate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatTime12 = (hour, minute) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${pad(h12)}:${pad(minute)} ${suffix}`;
};

const dateWithOffset = (offsetDays) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d;
};

const capitalize = (s) => s.charAt(0) + s.slice(1).toLowerCase();

const isOrderingOpen = (date) => {
  const deadline = new Date(date);
  deadline.setHours(COLLECT_BY.hour, COLLECT_BY.minute, 0, 0);
  const earliestAllowed =
    Date.now() + MIN_HOURS_BEFORE * 60 * 60 * 1000;
  return deadline.getTime() >= earliestAllowed;
};

export default function OrderPage({ student }) {
  const [offset, setOffset] = useState(() =>
    isOrderingOpen(dateWithOffset(0)) ? 0 : 1
  );
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [orderError, setOrderError] = useState("");
  const [placing, setPlacing] = useState(false);

  const pickupDate = dateWithOffset(offset);
  const dayName = DAY_NAMES[pickupDate.getDay()];
  const todayOpen = isOrderingOpen(dateWithOffset(0));
  const collectByLabel = formatTime12(
    COLLECT_BY.hour,
    COLLECT_BY.minute
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    setQuantities({});

    axios
      .get(`${API_BASE}/menu`, {
        params: { day: dayName },
      })
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error(err);
        setItems([]);
        setError(
          "Unable to load the menu. Please check that the server is running."
        );
      })
      .finally(() => setLoading(false));
  }, [dayName]);

  const changeDate = (value) => {
    setOffset(Number(value));
    setOrderResult(null);
    setOrderError("");
  };

  const increase = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setOrderResult(null);
    setOrderError("");
  };

  const decrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
    setOrderResult(null);
    setOrderError("");
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );

  const selectedCount = items.reduce(
    (sum, item) => sum + (quantities[item.id] || 0),
    0
  );

  const placeOrder = () => {
    setOrderResult(null);
    setOrderError("");

    const selectedItems = items
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => ({
        menuItemId: item.id,
        quantity: quantities[item.id],
      }));

    if (selectedItems.length === 0) {
      setOrderError("Please select at least one item.");
      return;
    }

    const body = {
      studentId: student.id,
      pickupTime: `${formatDate(pickupDate)}T${pad(
        COLLECT_BY.hour
      )}:${pad(COLLECT_BY.minute)}:00`,
      items: selectedItems,
    };

    setPlacing(true);

    axios
      .post(`${API_BASE}/orders`, body)
      .then((res) => setOrderResult(res.data))
      .catch((err) => {
        console.error(err);
        const data = err.response?.data;

        if (!data) {
          setOrderError("Unable to connect to the server.");
        } else if (typeof data === "string") {
          setOrderError(prettifyDates(data));
        } else {
          setOrderError(
            prettifyDates(
              data.message || data.error || JSON.stringify(data)
            )
          );
        }
      })
      .finally(() => setPlacing(false));
  };

  const card = {
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    boxShadow: "var(--shadow)",
  };

  const primaryButton = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    padding: "13px 20px",
    background: "var(--primary)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
  };

  const mutedText = {
    color: "var(--muted)",
    lineHeight: 1.7,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--page-bg)",
        color: "var(--text)",
        fontFamily: "Inter, sans-serif",
        padding: "35px 5%",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
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
            to="/my-orders"
            style={{
              padding: "10px 15px",
              border: "1px solid var(--border)",
              borderRadius: 9,
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 13,
              background: "var(--surface)",
            }}
          >
            🎟️ My Orders
          </Link>
        </nav>

        <section
          style={{
            ...card,
            padding: "clamp(22px, 5vw, 42px)",
            marginBottom: 25,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "7px 11px",
              borderRadius: 20,
              background: "var(--surface-soft)",
              color: "var(--primary)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.3,
            }}
          >
            STUDENT FOOD ORDERING
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 46px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.15,
              margin: "18px 0 12px",
            }}
          >
            Hungry? Let's get
            <br />
            <span style={{ color: "var(--primary)" }}>your meal ready.</span>
          </h1>

          <p style={{ ...mutedText, maxWidth: 590, fontSize: 14 }}>
            Choose your favourite lunch, select the quantity and place
            your pre-order. Pick it up at the canteen counter on time.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <div
              style={{
                padding: "13px 16px",
                borderRadius: 11,
                background: "var(--surface-soft)",
                minWidth: 135,
              }}
            >
              <div style={{ fontSize: 11, ...mutedText }}>PICKUP TIME</div>
              <strong style={{ display: "block", marginTop: 5 }}>
                🕧 {collectByLabel}
              </strong>
            </div>

            <div
              style={{
                padding: "13px 16px",
                borderRadius: 11,
                background: "var(--danger-bg)",
                minWidth: 135,
              }}
            >
              <div style={{ fontSize: 11, color: "var(--danger-text)" }}>
                ORDER TYPE
              </div>
              <strong
                style={{
                  display: "block",
                  marginTop: 5,
                  color: "var(--danger-text)",
                }}
              >
                Lunch Pre-order
              </strong>
            </div>
          </div>
        </section>

        <section style={{ ...card, padding: "24px", marginBottom: 25 }}>
          <h2 style={{ fontSize: 19, margin: "0 0 8px" }}>
            👋 Welcome, {student.name}
          </h2>

          <p style={{ ...mutedText, fontSize: 13, margin: "0 0 20px" }}>
            Application Number: <strong>{student.applicationNumber}</strong>
          </p>

          <label
            htmlFor="pickup-day"
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 9,
            }}
          >
            Select your pickup day
          </label>

          <select
            id="pickup-day"
            value={offset}
            onChange={(e) => changeDate(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 400,
              padding: "13px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--input-bg)",
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
            }}
          >
            <option value={0} disabled={!todayOpen}>
              Today ({capitalize(DAY_NAMES[dateWithOffset(0).getDay()])})
              {!todayOpen ? " - ordering closed" : ""}
            </option>
            <option value={1}>
              Tomorrow ({capitalize(DAY_NAMES[dateWithOffset(1).getDay()])})
            </option>
          </select>

          <p style={{ ...mutedText, fontSize: 12, marginBottom: 0 }}>
            Orders must be placed at least {MIN_HOURS_BEFORE} hours before{" "}
            {collectByLabel}. Menu availability depends on the selected day.
          </p>
        </section>

        <section>
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
            <div>
              <h2 style={{ fontSize: 24, margin: "0 0 6px" }}>
                Today's Menu
              </h2>
              <p style={{ ...mutedText, fontSize: 13, margin: 0 }}>
                {capitalize(dayName)} · Choose your meal
              </p>
            </div>

            <div
              style={{
                background: "var(--surface-soft)",
                color: "var(--primary)",
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {selectedCount} item{selectedCount === 1 ? "" : "s"} selected
            </div>
          </div>

          {loading && (
            <div style={{ ...card, padding: 35, textAlign: "center" }}>
              <p style={{ fontSize: 16 }}>🍽️ Loading menu...</p>
              <p style={{ ...mutedText, fontSize: 13 }}>
                Please wait while we fetch the available food items.
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
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div style={{ ...card, padding: 35, textAlign: "center" }}>
              <div style={{ fontSize: 45 }}>🍱</div>
              <h3>No menu available</h3>
              <p style={{ ...mutedText, fontSize: 13 }}>
                There are no food items available for {capitalize(dayName)}.
                Please try another day.
              </p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
                gap: 17,
              }}
            >
              {items.map((item) => {
                const quantity = quantities[item.id] || 0;

                return (
                  <article
                    key={item.id}
                    style={{
                      ...card,
                      padding: 22,
                      display: "flex",
                      flexDirection: "column",
                      gap: 17,
                    }}
                  >
                    <div
                      style={{
                        height: 115,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 13,
                        background: "var(--surface-soft)",
                        fontSize: 53,
                      }}
                    >
                      🍛
                    </div>

                    <div>
                      <h3
                        style={{
                          fontSize: 18,
                          margin: "0 0 8px",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.name}
                      </h3>
                      <strong
                        style={{
                          color: "var(--primary)",
                          fontSize: 22,
                        }}
                      >
                        ₹{Number(item.price).toFixed(2)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        marginTop: "auto",
                        paddingTop: 14,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ ...mutedText, fontSize: 12 }}>
                        Quantity
                      </span>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => decrease(item.id)}
                          disabled={quantity === 0}
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 9,
                            border: "1px solid var(--border)",
                            background: "var(--surface-soft)",
                            color: "var(--text)",
                            fontSize: 20,
                            cursor: quantity === 0 ? "not-allowed" : "pointer",
                            opacity: quantity === 0 ? 0.5 : 1,
                          }}
                        >
                          −
                        </button>

                        <strong
                          style={{
                            minWidth: 18,
                            textAlign: "center",
                            fontSize: 15,
                          }}
                        >
                          {quantity}
                        </strong>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => increase(item.id)}
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 9,
                            border: "none",
                            background: "var(--primary)",
                            color: "#ffffff",
                            fontSize: 20,
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {quantity > 0 && (
                      <p
                        style={{
                          margin: 0,
                          color: "var(--success-text)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Subtotal: ₹
                        {(Number(item.price) * quantity).toFixed(2)}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {!loading && !error && items.length > 0 && (
          <section
            style={{
              ...card,
              marginTop: 25,
              padding: "24px",
              borderTop: "4px solid var(--primary)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 15,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p style={{ ...mutedText, fontSize: 13, margin: "0 0 6px" }}>
                  ORDER TOTAL
                </p>
                <strong
                  style={{
                    fontSize: "clamp(27px, 5vw, 36px)",
                    color: "var(--primary)",
                  }}
                >
                  ₹{total.toFixed(2)}
                </strong>
                <p style={{ ...mutedText, fontSize: 12, marginBottom: 0 }}>
                  {selectedCount} item{selectedCount === 1 ? "" : "s"} ·
                  Pickup before {collectByLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={placing || selectedCount === 0}
                style={{
                  ...primaryButton,
                  minWidth: 180,
                  opacity: placing || selectedCount === 0 ? 0.6 : 1,
                  cursor:
                    placing || selectedCount === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {placing ? "Placing order..." : "Place Order →"}
              </button>
            </div>

            {orderError && (
              <div
                role="alert"
                style={{
                  marginTop: 20,
                  padding: 15,
                  borderRadius: 10,
                  background: "var(--danger-bg)",
                  color: "var(--danger-text)",
                  fontSize: 13,
                }}
              >
                ❌ {orderError}
              </div>
            )}

            {orderResult && (
              <div
                role="status"
                style={{
                  marginTop: 22,
                  padding: 22,
                  borderRadius: 13,
                  border: "1px solid var(--success-text)",
                  background: "var(--success-bg)",
                }}
              >
                <h3
                  style={{
                    color: "var(--success-text)",
                    marginTop: 0,
                  }}
                >
                  ✅ Order placed successfully!
                </h3>

                <p style={{ color: "var(--text)", fontSize: 14 }}>
                  Order number: <strong>#{orderResult.order.id}</strong>
                </p>

                <p style={{ color: "var(--text)", fontSize: 14 }}>
                  Amount to pay at the counter:{" "}
                  <strong>
                    ₹{Number(orderResult.order.totalAmount).toFixed(2)}
                  </strong>
                </p>

                <p style={{ ...mutedText, fontSize: 13 }}>
                  Canteen counter-la unga application number (
                  {student.applicationNumber}) solli payment panni token
                  collect pannunga.
                </p>

                <Link
                  to="/my-orders"
                  style={{
                    ...primaryButton,
                    marginTop: 5,
                  }}
                >
                  View My Orders →
                </Link>
              </div>
            )}
          </section>
        )}

        <footer
          style={{
            textAlign: "center",
            padding: "30px 10px 10px",
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
