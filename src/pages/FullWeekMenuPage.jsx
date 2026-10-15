
import { useEffect, useState } from "react";

import { API_BASE } from "../api";

const API = `${API_BASE}/menu`;

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

export default function FullWeekMenuPage() {
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      setLoading(true);
      setError("");
      setMenu([]);

      try {
        const response = await fetch(`${API}?day=${selectedDay}`);

        if (!response.ok) {
          throw new Error("Menu load panna mudiyala.");
        }

        const data = await response.json();

        if (!cancelled) {
          setMenu(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Backend connect aagala.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [selectedDay]);

  const dayName = (day) =>
    day.charAt(0) + day.slice(1).toLowerCase();

  const availableCount = menu.filter((item) => item.available).length;

  return (
    <main className="week-menu-page">
      <style>{`
        .week-menu-page {
          max-width: 1250px;
          margin: 0 auto;
          padding: 30px 22px 45px;
          color: var(--text);
        }

        .week-menu-hero {
          position: relative;
          overflow: hidden;
          padding: 30px;
          border-radius: 24px;
          color: #fff;
          background: linear-gradient(120deg, #1d4ed8 0%, #2563eb 58%, #dc2626 100%);
          box-shadow: 0 14px 35px rgba(37,99,235,0.18);
        }

        .week-menu-hero::after {
          content: "";
          position: absolute;
          width: 210px;
          height: 210px;
          right: -55px;
          top: -90px;
          border: 35px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          pointer-events: none;
        }

        .week-menu-eyebrow {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #dbeafe;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .week-menu-title {
          position: relative;
          z-index: 1;
          margin: 12px 0 9px;
          font-size: clamp(27px, 4vw, 37px);
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .week-menu-description {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0;
          color: #eff6ff;
          font-size: 14px;
          line-height: 1.8;
        }

        .week-menu-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin: 22px 0;
        }

        .week-menu-stat {
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

        .week-menu-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 47px;
          height: 47px;
          border-radius: 14px;
          font-size: 22px;
        }

        .week-menu-stat-icon.blue {
          color: #2563eb;
          background: #dbeafe;
        }

        .week-menu-stat-icon.green {
          color: #15803d;
          background: #dcfce7;
        }

        .week-menu-stat-icon.red {
          color: #dc2626;
          background: #fee2e2;
        }

        .week-menu-stat-label {
          margin: 0 0 5px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .week-menu-stat-value {
          margin: 0;
          color: var(--text);
          font-size: 25px;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .week-menu-section {
          margin-top: 22px;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .week-menu-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .week-menu-section-title {
          margin: 0;
          color: var(--text);
          font-size: 19px;
          font-weight: 850;
        }

        .week-menu-section-subtitle {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .week-menu-day-list {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .week-menu-day-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 47px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface-soft);
          color: var(--text);
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
        }

        .week-menu-day-button:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .week-menu-day-button.active {
          border-color: transparent;
          background: linear-gradient(110deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 6px 14px rgba(37,99,235,0.2);
        }

        .week-menu-selected-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin: 30px 0 17px;
        }

        .week-menu-selected-title {
          margin: 0;
          color: var(--text);
          font-size: 23px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .week-menu-result-count {
          display: inline-flex;
          align-items: center;
          padding: 7px 11px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surface);
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
        }

        .week-menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(235px, 1fr));
          gap: 17px;
        }

        .week-menu-card {
          position: relative;
          overflow: hidden;
          padding: 21px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--surface);
          box-shadow: var(--shadow);
          transition: transform 0.2s, border-color 0.2s;
        }

        .week-menu-card:hover {
          transform: translateY(-3px);
          border-color: var(--primary);
        }

        .week-menu-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .week-menu-food-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 47px;
          height: 47px;
          border-radius: 14px;
          background: var(--surface-soft);
          font-size: 24px;
        }

        .week-menu-availability {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .week-menu-availability.available {
          background: var(--success-bg, #dcfce7);
          color: var(--success-text, #166534);
        }

        .week-menu-availability.unavailable {
          background: var(--danger-bg, #fee2e2);
          color: var(--danger-text, #991b1b);
        }

        .week-menu-item-name {
          margin: 19px 0 7px;
          color: var(--text);
          font-size: 18px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .week-menu-item-caption {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
        }

        .week-menu-card-divider {
          height: 1px;
          margin: 18px 0;
          background: var(--border);
        }

        .week-menu-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .week-menu-price-label {
          margin: 0 0 4px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
        }

        .week-menu-price {
          margin: 0;
          color: var(--primary);
          font-size: 24px;
          font-weight: 900;
        }

        .week-menu-served-day {
          max-width: 110px;
          padding: 7px 9px;
          border-radius: 9px;
          background: var(--surface-soft);
          color: var(--muted);
          font-size: 10px;
          font-weight: 800;
          text-align: center;
          overflow-wrap: anywhere;
        }

        .week-menu-state {
          padding: 45px 20px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: var(--surface);
          text-align: center;
        }

        .week-menu-state-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          border-radius: 18px;
          background: var(--surface-soft);
          font-size: 28px;
        }

        .week-menu-state h3 {
          margin: 0 0 8px;
          color: var(--text);
          font-size: 17px;
        }

        .week-menu-state p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .week-menu-error {
          border-color: var(--border);
        }

        .week-menu-error .week-menu-state-icon {
          background: var(--danger-bg, #fee2e2);
        }

        .week-menu-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-bottom: 13px;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: week-menu-spin 0.8s linear infinite;
        }

        @keyframes week-menu-spin {
          to { transform: rotate(360deg); }
        }

        :root[data-theme="dark"] .week-menu-stat-icon.blue {
          color: #93c5fd;
          background: #172554;
        }

        :root[data-theme="dark"] .week-menu-stat-icon.green {
          color: #86efac;
          background: #14532d;
        }

        :root[data-theme="dark"] .week-menu-stat-icon.red {
          color: #fca5a5;
          background: #451a24;
        }

        @media (max-width: 760px) {
          .week-menu-page {
            padding: 20px 13px 32px;
          }

          .week-menu-hero {
            padding: 24px 20px;
            border-radius: 19px;
          }

          .week-menu-stats {
            grid-template-columns: 1fr;
            gap: 11px;
            margin: 16px 0;
          }

          .week-menu-stat {
            padding: 15px;
          }

          .week-menu-stat-value {
            font-size: 22px;
          }

          .week-menu-section {
            padding: 18px;
          }

          .week-menu-day-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .week-menu-day-button:last-child {
            grid-column: 1 / -1;
          }

          .week-menu-selected-title {
            font-size: 21px;
          }
        }

        @media (min-width: 500px) and (max-width: 760px) {
          .week-menu-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <section className="week-menu-hero">
        <div className="week-menu-eyebrow">
          <span>🍽️</span>
          CAMPUS CANTEEN / WEEKLY MENU
        </div>

        <h1 className="week-menu-title">Full Week Menu</h1>

        <p className="week-menu-description">
          Monday to Friday canteen menu details ore idathula paarunga.
          Ungalukku thevaiyana naalai select panni food items, price
          and availability check pannalaam.
        </p>
      </section>

      <section className="week-menu-stats">
        <div className="week-menu-stat">
          <div className="week-menu-stat-icon blue">📅</div>
          <div>
            <p className="week-menu-stat-label">Selected Day</p>
            <p className="week-menu-stat-value">{dayName(selectedDay)}</p>
          </div>
        </div>

        <div className="week-menu-stat">
          <div className="week-menu-stat-icon green">🍱</div>
          <div>
            <p className="week-menu-stat-label">Menu Items</p>
            <p className="week-menu-stat-value">
              {loading ? "..." : menu.length}
            </p>
          </div>
        </div>

        <div className="week-menu-stat">
          <div className="week-menu-stat-icon red">✓</div>
          <div>
            <p className="week-menu-stat-label">Available Items</p>
            <p className="week-menu-stat-value">
              {loading ? "..." : availableCount}
            </p>
          </div>
        </div>
      </section>

      <section className="week-menu-section">
        <div className="week-menu-section-header">
          <div>
            <h2 className="week-menu-section-title">Choose a Day</h2>
            <p className="week-menu-section-subtitle">
              Endha naal menu venumo andha day-ah select pannu.
            </p>
          </div>
        </div>

        <div className="week-menu-day-list">
          {days.map((day, index) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`week-menu-day-button ${
                selectedDay === day ? "active" : ""
              }`}
              aria-pressed={selectedDay === day}
            >
              <span>{["🌅", "☀️", "🍱", "🥗", "🎉"][index]}</span>
              {dayName(day)}
            </button>
          ))}
        </div>
      </section>

      <div className="week-menu-selected-heading">
        <div>
          <h2 className="week-menu-selected-title">
            {dayName(selectedDay)} Menu
          </h2>
          <p className="week-menu-section-subtitle">
            Innaiku select pannirukkura day-oda menu details.
          </p>
        </div>

        {!loading && !error && (
          <span className="week-menu-result-count">
            {menu.length} {menu.length === 1 ? "Item" : "Items"}
          </span>
        )}
      </div>

      {loading && (
        <div className="week-menu-state" role="status">
          <span className="week-menu-spinner" />
          <h3>Menu loading...</h3>
          <p>{dayName(selectedDay)} menu details fetch pannitu irukkom.</p>
        </div>
      )}

      {error && (
        <div className="week-menu-state week-menu-error" role="alert">
          <div className="week-menu-state-icon">⚠️</div>
          <h3>Menu load aagala</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && menu.length === 0 && (
        <div className="week-menu-state">
          <div className="week-menu-state-icon">🍽️</div>
          <h3>Menu items innum available illa</h3>
          <p>
            {dayName(selectedDay)}-ku menu items edhuvum illa.
            Vera naal select panni paarunga.
          </p>
        </div>
      )}

      {!loading && !error && menu.length > 0 && (
        <div className="week-menu-grid">
          {menu.map((item) => (
            <article className="week-menu-card" key={item.id}>
              <div className="week-menu-card-top">
                <div className="week-menu-food-icon">🍛</div>

                <span
                  className={`week-menu-availability ${
                    item.available ? "available" : "unavailable"
                  }`}
                >
                  <span>{item.available ? "●" : "●"}</span>
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <h3 className="week-menu-item-name">{item.name}</h3>

              <p className="week-menu-item-caption">
                Campus Canteen Menu Item
              </p>

              <div className="week-menu-card-divider" />

              <div className="week-menu-card-bottom">
                <div>
                  <p className="week-menu-price-label">Price</p>
                  <p className="week-menu-price">
                    ₹{Number(item.price ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="week-menu-served-day">
                  📅 {dayName(item.day || selectedDay)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
