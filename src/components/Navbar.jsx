import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Navbar.css";

/* IMPORT LOGO */
import logo from "../assets/logo.png";   // <-- place your logo file here

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    setUser(null);
    navigate("/auth");
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="top-contact-bar">
        <span>📞 +91 95666 26109</span>
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