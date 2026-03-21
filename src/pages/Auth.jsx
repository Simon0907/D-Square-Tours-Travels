import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          localStorage.setItem("adminAuth", "true");
          alert("Admin Login Successful!");
          navigate("/admin");
        } else {
          alert("Login Successful");
          navigate("/");
        }
      } else {
        alert("Signup successful! Please login");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className={`auth-card ${isLogin ? "login-mode" : "signup-mode"}`}>
        <div className="card-glow"></div>

        <div className="auth-header">
          <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="auth-subtitle">
            {isLogin ? "Enter your credentials to continue" : "Sign up to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`input-group ${!isLogin ? "visible" : "hidden"}`}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required={!isLogin}
              className="auth-input"
            />
            <span className="input-border"></span>
          </div>

          <div className="input-group visible">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
            <span className="input-border"></span>
          </div>

          <div className="input-group visible">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
            <span className="input-border"></span>
          </div>

          <button type="submit" className="auth-button">
            <span className="button-text">
              {isLogin ? "Sign In" : "Create Account"}
            </span>
            <span className="button-shine"></span>
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setForm({ name: "", email: "", password: "" });
          }}
          className="toggle-button"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>

        {isLogin && (
          <div className="admin-hint">
            <span className="hint-icon">🔐</span>
            <span>Admin Login Available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;  