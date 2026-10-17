
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import OrderPage from "./pages/OrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminTokensPage from "./pages/AdminTokensPage";
import AdminBlockedStudentsPage from "./pages/AdminBlockedStudentsPage";
import FullWeekMenuPage from "./pages/FullWeekMenuPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import HomePage from "./pages/HomePage";

import { getStudent, saveStudent, clearStudent } from "./auth";
import {
  getAdminToken,
  clearAdminToken,
} from "./adminAuth";
import { useTheme } from "./ThemeContext";

function Layout() {
  const [student, setStudent] = useState(getStudent);
  const [adminToken, setAdminToken] = useState(getAdminToken);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminLoginPage = location.pathname === "/admin/login";

  const handleLogin = (loggedInStudent) => {
    saveStudent(loggedInStudent);
    setStudent(loggedInStudent);
    navigate("/");
  };

  const handleLogout = () => {
    clearStudent();
    setStudent(null);
    navigate("/");
  };

  const handleAdminLogin = () => {
    setAdminToken(getAdminToken());
    navigate("/admin/tokens");
  };

  const handleAdminLogout = () => {
    clearAdminToken();
    setAdminToken(null);
    navigate("/admin/login");
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 24px",
    borderBottom: "1px solid var(--border)",
    flexWrap: "wrap",
    background: "var(--surface)",
    color: "var(--text)",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "var(--text)",
    fontWeight: 500,
  };

  const themeButtonStyle = {
    padding: "9px 14px",
    borderRadius: 20,
    border: "1px solid var(--border)",
    background: "var(--primary)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <>
      <nav style={navStyle}>
        <Link
          to="/"
          style={{
            ...linkStyle,
            fontSize: 20,
            fontWeight: "bold",
            marginRight: "auto",
          }}
        >
          CampusBite
        </Link>

        {isAdminPage && adminToken ? (
          <>
            <Link style={linkStyle} to="/admin/orders">
              All Orders
            </Link>
            <Link style={linkStyle} to="/admin/tokens">
              Token Management
            </Link>
            <Link style={linkStyle} to="/admin/blocked-students">
              Blocked Students
            </Link>
            <Link style={linkStyle} to="/admin/full-week-menu">
              Full Week Menu
            </Link>
            <Link style={linkStyle} to="/admin/menu">
              Menu Management
            </Link>
            <button type="button" onClick={handleAdminLogout}>
              Admin Logout
            </button>
          </>
        ) : isAdminLoginPage ? null : student ? (
          <>
            <Link style={linkStyle} to="/">
              Order Food
            </Link>
            <Link style={linkStyle} to="/full-week-menu">
              Menu List
            </Link>
            <Link style={linkStyle} to="/my-orders">
              My Orders
            </Link>
            <span>Hi, {student.name}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link style={linkStyle} to="/login">
              Student Login
            </Link>
            <Link style={linkStyle} to="/register">
              Register
            </Link>
            <Link style={linkStyle} to="/admin/login">
              Admin Login
            </Link>
          </>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          style={themeButtonStyle}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            student ? <OrderPage student={student} /> : <HomePage />
          }
        />

        <Route
          path="/login"
          element={
            student ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            student ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterPage onRegistered={handleLogin} />
            )
          }
        />

        <Route
          path="/my-orders"
          element={
            student ? (
              <MyOrdersPage student={student} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/full-week-menu"
          element={
            student ? (
              <FullWeekMenuPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/login"
          element={
            adminToken ? (
              <Navigate to="/admin/tokens" replace />
            ) : (
              <AdminLoginPage onLogin={handleAdminLogin} />
            )
          }
        />

        <Route
          path="/admin/orders"
          element={
            adminToken ? (
              <AdminOrdersPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route
          path="/admin/tokens"
          element={
            adminToken ? (
              <AdminTokensPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route
          path="/admin/blocked-students"
          element={
            adminToken ? (
              <AdminBlockedStudentsPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route
          path="/admin/full-week-menu"
          element={
            adminToken ? (
              <FullWeekMenuPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route
          path="/admin/menu"
          element={
            adminToken ? (
              <AdminMenuPage />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
