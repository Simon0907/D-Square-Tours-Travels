import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

const ADMIN_EMAIL = "admin@dsquare.com";
const ADMIN_PASSWORD = "Dsquare@Admin123";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      isLogin &&
      form.email === ADMIN_EMAIL &&
      form.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("adminAuth", "true");
      alert("Admin Login Successful!");
      navigate("/admin");
      return;
    }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === form.email && u.password === form.password
      );

      if (user) {
        alert("Login Successful");
      } else {
        alert("Invalid credentials");
      }
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(form);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please login");
      setIsLogin(true);
      setForm({ name: "", email: "", password: "" });
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
