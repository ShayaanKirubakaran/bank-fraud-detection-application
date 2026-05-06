import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <section
        className="card-lg"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "2rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>
            Welcome Back
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Log in to access your fraud detection dashboard.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: "700", display: "block", marginBottom: "0.4rem" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="test@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.85rem" }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontWeight: "700", display: "block", marginBottom: "0.4rem" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.85rem" }}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "0.9rem 1rem" }}>
            Login
          </button>
        </form>

        <p className="muted" style={{ marginTop: "1.25rem", textAlign: "center" }}>
          Do not have an account?{" "}
          <Link to="/register" style={{ color: "#2563eb", fontWeight: "700" }}>
            Register here
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;