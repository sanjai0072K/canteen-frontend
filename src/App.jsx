
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
import { useTheme } from "./ThemeContext";

function Layout() {
  const [student, setStudent] = useState(getStudent);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isAdminPage = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

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

        {isAdminPage ? (
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
          </>
        ) : student ? (
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
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : !isHomePage ? (
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
        ) : null}

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
          element={student ? <OrderPage student={student} /> : <HomePage />}
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
            student ? <FullWeekMenuPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/login"
          element={<AdminLoginPage onLogin={() => {}} />}
        />

        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/tokens" element={<AdminTokensPage />} />

        <Route
          path="/admin/blocked-students"
          element={<AdminBlockedStudentsPage />}
        />

        <Route
          path="/admin/full-week-menu"
          element={<FullWeekMenuPage />}
        />

        <Route path="/admin/menu" element={<AdminMenuPage />} />
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
