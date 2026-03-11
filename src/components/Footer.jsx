import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={footer}>
      <div style={topBorder}></div>

      <div style={container}>

        {/* ABOUT */}
        <div>
          <h3 style={heading}>About Us</h3>
          <p style={text}>
            We provide tailored Madurai Local Tour Packages, ideal for
            discovering the city's iconic temples, heritage spots, and
            vibrant markets.
          </p>
          <p style={text}>
            With Vismi Cabs, you get a comfortable, reliable, and enriching
            travel experience wherever you go.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 style={heading}>Quick Links</h3>
          <ul style={list}>
            <ul className="footer-links">
  <li>
    <Link to="/">Home</Link>
  </li>
  <li>
    <Link to="/about">About Us</Link>
  </li>
  <li>
    <Link to="/ourservice">Our Services</Link>
  </li>
  <li>
    <Link to="/packages">Packages</Link>
  </li>
  <li>
    <Link to="/contact">Contact Us</Link>
  </li>
</ul>

          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 style={heading}>Contact Us</h3>
          <ul style={contact}>
            <li>🚖 D Square Tour and Travels</li>
            <li>📍 158, Muniyandipuram 1st,Pasumalai,Madurai – 625004, Tamilnadu, India.</li>
            <li>📞 +91 95666 26109</li>
            <li>📞 +91 73056 77077</li>
            <li>✉️ dsquaretourtravles@gmail.com</li>
            <li>🌐 www.D Square Tours & Travels.com</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div style={bottom}>
        Copyright © 2026 D Square Tours &Travels. All Rights Reserved.
      </div>
    </footer>
  );
};

/* ===== STYLES ===== */

const footer = {
  background: "#020617", // same as hero/nav
  color: "#fff",
  marginTop: "100px",
};

const topBorder = {
  height: "4px",
  background: "#f97316", // brand orange
};

const container = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "60px 40px",
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr 1.4fr",
  gap: "60px",
};

const heading = {
  fontSize: "22px",
  marginBottom: "20px",
};

const text = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  fontSize: "15px",
  marginBottom: "15px",
};

const list = {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "10px",
  color: "#cbd5e1",
  cursor: "pointer",
};

const contact = {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "12px",
  color: "#cbd5e1",
};

const bottom = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  textAlign: "center",
  padding: "20px",
  fontSize: "14px",
  color: "#cbd5e1",
};


export default Footer;
