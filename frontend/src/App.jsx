import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FraudAlerts from "./pages/FraudAlerts";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/dashboard" style={{ marginRight: "1rem" }}>
          Dashboard
        </Link>

        {token && (
          <Link to="/fraud-alerts" style={{ marginRight: "1rem" }}>
            Fraud Alerts
          </Link>
        )}

        {!token && (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <span style={{ marginRight: "1rem" }}>
              Logged in as {user?.full_name}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fraud-alerts"
          element={
            <ProtectedRoute>
              <FraudAlerts />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;