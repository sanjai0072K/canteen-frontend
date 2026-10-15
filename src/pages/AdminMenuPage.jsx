
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminHeaders, clearAdminToken } from "../adminAuth";

import { API_BASE } from "../api";

const API = `${API_BASE}/admin/menu`;

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const buttonStyle = {
  border: "none",
  borderRadius: 9,
  padding: "10px 15px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default function AdminMenuPage() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState("ALL");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    day: "MONDAY",
    available: true,
  });

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...adminHeaders(),
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401 || response.status === 403) {
      clearAdminToken();
      navigate("/admin/login");
      throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed (${response.status}).`);
    }

    if (response.status === 204) return null;

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async function loadMenu() {
    setLoading(true);
    setError("");

    try {
      const data = await request(API);
      setMenu(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu();
  }, []);

  function resetForm() {
    setForm({
      name: "",
      price: "",
      day: "MONDAY",
      available: true,
    });
    setEditingId(null);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleEdit(item) {
    setMessage("");
    setError("");
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      price: String(item.price ?? ""),
      day: item.day || "MONDAY",
      available: Boolean(item.available),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveMenuItem(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const name = form.name.trim();
    const price = Number(form.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid food name and a price greater than zero.");
      return;
    }

    const payload = {
      name,
      price,
      day: form.day,
      available: form.available,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await request(`${API}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Menu item updated successfully!");
      } else {
        await request(API, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Menu item added successfully!");
      }

      resetForm();
      await loadMenu();
    } catch (err) {
      setError(err.message || "Unable to save the menu item.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMenuItem(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await request(`${API}/${item.id}`, { method: "DELETE" });
      setMessage("Menu item deleted successfully!");
      await loadMenu();
    } catch (err) {
      setError(err.message || "Unable to delete the menu item.");
    }
  }

  async function toggleAvailability(item) {
    setMessage("");
    setError("");

    const payload = {
      name: item.name,
      price: Number(item.price),
      day: item.day,
      available: !item.available,
    };

    try {
      await request(`${API}/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setMessage("Menu item availability updated successfully!");
      await loadMenu();
    } catch (err) {
      setError(err.message || "Unable to update menu item availability.");
    }
  }

  const filteredMenu =
    selectedDay === "ALL"
      ? menu
      : menu.filter((item) => item.day === selectedDay);

  const availableCount = menu.filter((item) => item.available).length;
  const unavailableCount = menu.length - availableCount;

  const inputStyle = {
    width: "100%",
    padding: "12px 13px",
    marginTop: 8,
    border: "1px solid var(--border)",
    borderRadius: 9,
    background: "var(--input-bg)",
    color: "var(--text)",
    outlineColor: "var(--primary)",
  };

  return (
    <main className="admin-menu-page">
      <style>{`
        .admin-menu-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 34px 22px 60px;
          color: var(--text);
        }
        .admin-menu-page * { box-sizing: border-box; }
        .menu-hero {
          position: relative;
          overflow: hidden;
          padding: 32px;
          border-radius: 22px;
          background: linear-gradient(120deg, #1d4ed8, #2563eb 62%, #dc2626);
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 12px 32px rgba(37, 99, 235, .2);
        }
        .menu-hero h1 { margin: 0 0 10px; font-size: clamp(25px, 4vw, 34px); }
        .menu-hero p { margin: 0; line-height: 1.7; color: #eff6ff; }
        .menu-hero-icon {
          position: absolute; right: 28px; top: 50%;
          transform: translateY(-50%); font-size: 76px; opacity: .22;
        }
        .menu-stat-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px; margin-bottom: 26px;
        }
        .menu-stat {
          padding: 20px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; box-shadow: var(--shadow);
        }
        .menu-stat-label { color: var(--muted); font-size: 13px; font-weight: 600; }
        .menu-stat-value { font-size: 29px; font-weight: 800; margin-top: 8px; }
        .menu-stat-icon { font-size: 22px; margin-bottom: 10px; }
        .menu-panel {
          padding: 24px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 18px; box-shadow: var(--shadow); margin-bottom: 25px;
        }
        .menu-panel-title {
          display: flex; align-items: center; gap: 12px; margin: 0 0 22px;
          font-size: 21px;
        }
        .menu-title-icon {
          display: grid; place-items: center; width: 42px; height: 42px;
          background: var(--surface-soft); border-radius: 12px; font-size: 21px;
        }
        .menu-form-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 17px;
        }
        .menu-field { display: block; font-size: 13px; font-weight: 700; }
        .menu-checkbox {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .menu-checkbox input { accent-color: var(--primary); width: 17px; height: 17px; }
        .menu-form-actions {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 22px;
        }
        .menu-primary-btn {
          background: var(--primary); color: white; border: none;
          border-radius: 9px; padding: 11px 18px; font-weight: 700;
        }
        .menu-primary-btn:hover { filter: brightness(1.1); }
        .menu-secondary-btn {
          background: var(--surface-soft); color: var(--text);
          border: 1px solid var(--border); border-radius: 9px;
          padding: 10px 15px; font-weight: 600;
        }
        .menu-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0; }
        .menu-filter-btn {
          border: 1px solid var(--border); border-radius: 999px;
          padding: 9px 15px; background: var(--surface); color: var(--text);
          font-size: 13px; font-weight: 700;
        }
        .menu-filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .menu-table-wrap {
          overflow-x: auto; border: 1px solid var(--border); border-radius: 12px;
        }
        .menu-table { width: 100%; border-collapse: collapse; min-width: 780px; }
        .menu-table th {
          background: var(--table-head); color: var(--muted);
          padding: 14px; font-size: 12px; text-transform: uppercase;
          letter-spacing: .05em; white-space: nowrap;
        }
        .menu-table td {
          padding: 15px 14px; border-bottom: 1px solid var(--border);
          color: var(--text); font-size: 13px;
        }
        .menu-table tr:last-child td { border-bottom: none; }
        .menu-table tbody tr:hover { background: var(--surface-soft); }
        .menu-food-name { font-weight: 700; font-size: 14px; }
        .menu-food-icon {
          display: inline-grid; place-items: center; width: 34px; height: 34px;
          margin-right: 10px; border-radius: 10px; background: var(--surface-soft);
        }
        .menu-day-badge {
          display: inline-block; padding: 6px 9px; border-radius: 7px;
          background: var(--surface-soft); color: var(--primary);
          font-size: 11px; font-weight: 800;
        }
        .menu-status {
          display: inline-block; border-radius: 999px; padding: 6px 10px;
          font-size: 11px; font-weight: 800; white-space: nowrap;
        }
        .menu-status.available { background: var(--success-bg); color: var(--success-text); }
        .menu-status.unavailable { background: var(--danger-bg); color: var(--danger-text); }
        .menu-actions { display: flex; flex-wrap: wrap; gap: 6px; }
        .menu-action-btn {
          border: 1px solid var(--border); border-radius: 7px; padding: 7px 9px;
          background: var(--surface); color: var(--text); font-size: 11px; font-weight: 700;
        }
        .menu-action-btn.edit { color: var(--primary); border-color: var(--primary); }
        .menu-action-btn.delete { color: var(--accent); border-color: var(--accent); }
        .menu-alert {
          padding: 13px 16px; border-radius: 10px; margin: 0 0 18px;
          font-size: 14px; font-weight: 600;
        }
        .menu-alert.success { background: var(--success-bg); color: var(--success-text); }
        .menu-alert.error { background: var(--danger-bg); color: var(--danger-text); }
        .menu-empty {
          padding: 40px 20px; text-align: center; color: var(--muted);
          background: var(--surface-soft); border-radius: 12px;
        }
        @media (max-width: 700px) {
          .admin-menu-page { padding: 20px 13px 40px; }
          .menu-hero { padding: 25px 20px; }
          .menu-hero-icon { right: 15px; font-size: 48px; }
          .menu-stat-grid { grid-template-columns: 1fr; gap: 10px; }
          .menu-stat { padding: 15px; }
          .menu-stat-value { font-size: 24px; }
          .menu-form-grid { grid-template-columns: 1fr; }
          .menu-panel { padding: 17px; }
          .menu-panel-title { font-size: 18px; }
        }
      `}</style>

      <header className="menu-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>
            CANTEEN ADMINISTRATION
          </div>
          <h1>Menu Management</h1>
          <p>Manage your food menu, update prices, and control daily availability.</p>
        </div>
        <div className="menu-hero-icon" aria-hidden="true">🍱</div>
      </header>

      {message && (
        <div className="menu-alert success" role="status">✓ {message}</div>
      )}
      {error && (
        <div className="menu-alert error" role="alert">⚠ {error}</div>
      )}

      <section className="menu-stat-grid">
        <div className="menu-stat">
          <div className="menu-stat-icon">🍽️</div>
          <div className="menu-stat-label">TOTAL MENU ITEMS</div>
          <div className="menu-stat-value">{menu.length}</div>
        </div>
        <div className="menu-stat">
          <div className="menu-stat-icon">✅</div>
          <div className="menu-stat-label">AVAILABLE ITEMS</div>
          <div className="menu-stat-value" style={{ color: "var(--success-text)" }}>
            {availableCount}
          </div>
        </div>
        <div className="menu-stat">
          <div className="menu-stat-icon">⛔</div>
          <div className="menu-stat-label">UNAVAILABLE ITEMS</div>
          <div className="menu-stat-value" style={{ color: "var(--accent)" }}>
            {unavailableCount}
          </div>
        </div>
      </section>

      <section className="menu-panel">
        <h2 className="menu-panel-title">
          <span className="menu-title-icon">{editingId !== null ? "✏️" : "➕"}</span>
          {editingId !== null ? "Edit Menu Item" : "Add New Food Item"}
        </h2>

        <form onSubmit={saveMenuItem}>
          <div className="menu-form-grid">
            <label className="menu-field">
              Food Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Veg Meals"
                required
                style={inputStyle}
              />
            </label>

            <label className="menu-field">
              Price (₹)
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 60"
                required
                style={inputStyle}
              />
            </label>

            <label className="menu-field">
              Serving Day
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                style={inputStyle}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="menu-form-actions">
            <label className="menu-checkbox">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
              />
              Available for ordering
            </label>

            <div style={{ flex: 1 }} />

            {editingId !== null && (
              <button
                type="button"
                className="menu-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

            <button type="submit" className="menu-primary-btn" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId !== null
                ? "✓ Update Item"
                : "+ Add Menu Item"}
            </button>
          </div>
        </form>
      </section>

      <section className="menu-panel">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <div>
            <h2 className="menu-panel-title" style={{ marginBottom: 5 }}>
              <span className="menu-title-icon">📋</span>
              Menu Items
            </h2>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              {filteredMenu.length} item{filteredMenu.length !== 1 ? "s" : ""} displayed
            </div>
          </div>

          <button
            onClick={loadMenu}
            disabled={loading}
            className="menu-secondary-btn"
          >
            {loading ? "⏳ Loading..." : "↻ Refresh"}
          </button>
        </div>

        <div className="menu-filter-row">
          <button
            className={`menu-filter-btn ${selectedDay === "ALL" ? "active" : ""}`}
            onClick={() => setSelectedDay("ALL")}
          >
            All Days ({menu.length})
          </button>

          {days.map((day) => {
            const count = menu.filter((item) => item.day === day).length;

            return (
              <button
                key={day}
                className={`menu-filter-btn ${selectedDay === day ? "active" : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                {day.charAt(0) + day.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>

        {loading && menu.length === 0 ? (
          <div className="menu-empty">⏳ Loading menu items...</div>
        ) : filteredMenu.length === 0 ? (
          <div className="menu-empty">
            <div style={{ fontSize: 38, marginBottom: 12 }}>🍽️</div>
            <strong>No menu items found</strong>
            <p style={{ marginBottom: 0 }}>
              {selectedDay === "ALL"
                ? "Add your first food item using the form above."
                : "No food items are listed for this day yet."}
            </p>
          </div>
        ) : (
          <div className="menu-table-wrap">
            <table className="menu-table">
              <thead>
                <tr>
                  {["ID", "Food Item", "Price", "Day", "Availability", "Actions"].map(
                    (heading) => (
                      <th key={heading}>{heading}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredMenu.map((item) => (
                  <tr key={item.id}>
                    <td style={{ color: "var(--muted)", fontWeight: 700 }}>
                      #{item.id}
                    </td>
                    <td>
                      <span className="menu-food-icon">🍴</span>
                      <span className="menu-food-name">{item.name}</span>
                    </td>
                    <td style={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                      ₹{Number(item.price).toFixed(2)}
                    </td>
                    <td>
                      <span className="menu-day-badge">
                        {item.day?.charAt(0) + item.day?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`menu-status ${item.available ? "available" : "unavailable"}`}>
                        {item.available ? "● Available" : "● Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className="menu-actions">
                        <button
                          className="menu-action-btn edit"
                          onClick={() => handleEdit(item)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="menu-action-btn"
                          onClick={() => toggleAvailability(item)}
                        >
                          {item.available ? "Disable" : "Enable"}
                        </button>
                        <button
                          className="menu-action-btn delete"
                          onClick={() => deleteMenuItem(item)}
                        >
                          🗑 Delete
                        </button>
                      </div>
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
