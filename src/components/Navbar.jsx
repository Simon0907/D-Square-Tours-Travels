import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Navbar.css";

import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null); // ← UPDATED: reactive sync
    };

    syncUser(); // run on mount

    window.addEventListener("storage", syncUser); // ← ADDED: listen for login/logout
    return () => window.removeEventListener("storage", syncUser); // cleanup
  }, []);

  const logout = () => {
    localStorage.removeItem("token");  // ← ADDED: also clear token on logout
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    window.dispatchEvent(new Event("storage")); // ← ADDED: sync instantly on logout
    setUser(null);
    navigate("/auth");
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="top-contact-bar">
        <span>📞 +91 86808 68173</span>
        <span>✉️ dsquaretourtravles@gmail.com</span>
      </div>

      <nav className="navbar">

        {/* LOGO */}
        <div className="navbar-logo">
          <img src={logo} alt="D Square Tours & Travels Logo" />
        </div>

        {/* NAV LINKS */}
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/ourservice">Our Services</Link>
          <Link to="/ourvehicles">Our Vehicles</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* LOGIN / USER */}
        {user ? (
          <div className="navbar-user-box">
            <span className="navbar-username">Hi, {user.name}</span>
            <button className="navbar-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="navbar-auth-btn" onClick={() => navigate("/auth")}>
            Log In
          </button>
        )}

      </nav>
    </>
  );
};

export default Navbar;