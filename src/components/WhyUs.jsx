import { useEffect, useRef, useState } from "react";

const WhyUs = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [boxHover, setBoxHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  /* ===== Scroll Reveal ===== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ===== Responsive ===== */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section ref={sectionRef} style={section}>
      <div
        style={{
          ...container,
          gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
        }}
      >

        {/* LEFT */}
        <div
          style={{
            ...left,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s ease",
          }}
        >
          <span style={tag}>WHY CHOOSE US</span>

          <h2 style={title}>
            Making your travel experience <br />
            comfortable & memorable
          </h2>

          <p style={desc}>
            Best Tour Operator In Madurai, Travels In Madurai, Cab Services In
            Madurai, Car Rental In Madurai, Wedding Car Rental In Madurai, Cab
            Booking Online In Madurai, Best Travels In Madurai, Kodaikanal Tour
            Operator In Madurai, Kanyakumari Tour Operator In Madurai,
            Rameswaram Tour Operator In Madurai, Munnar Tour Operator In
            Madurai, Cochin Tour Operator In Madurai, Madurai Car Operator,
            Madurai Travels, Tours and Travels Madurai, Madurai Cab Booking,
            Car Rental Online Booking Madurai.
          </p>

          <div
            style={{
              ...cities,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "20px" : "80px",
            }}
          >
            <ul style={list}>
              <li>› Madurai</li>
              <li>› Rameswaram</li>
              <li>› Kanyakumari</li>
              <li>› Trivandrum</li>
              <li>› Alleppey</li>
              <li>› Cochin</li>
            </ul>
            <ul style={list}>
              <li>› Munnar</li>
              <li>› Kodaikanal</li>
              <li>› Thekkady</li>
              <li>› Ooty</li>
              <li>› Coimbatore</li>
            </ul>
          </div>
        </div>

        {/* FORM */}
        <div
          style={{
            ...formBox,
            opacity: visible ? 1 : 0,
            transform: visible
              ? boxHover
                ? "translateY(-10px) scale(1.02)"
                : "translateY(0)"
              : "translateY(60px)",
            boxShadow: boxHover
              ? "0 35px 90px rgba(0,0,0,0.6)"
              : "0 20px 60px rgba(0,0,0,0.35)",
            transition: "all 0.8s ease",
          }}
          onMouseEnter={() => setBoxHover(true)}
          onMouseLeave={() => setBoxHover(false)}
        >
          <h3 style={formTitle}>Get In Touch</h3>

          <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
            <input style={input} placeholder="Name" />
            <input style={input} placeholder="Email" />
          </div>

          <input style={inputFull} placeholder="Phone Number" />

          <select style={inputFull}>
            <option>—Please choose an option—</option>
            <option>Tour Package</option>
            <option>Cab Booking</option>
            <option>Custom Trip</option>
          </select>

          <textarea style={textarea} placeholder="Message" rows="4" />

          <button
            style={{
              ...btn,
              transform: btnHover ? "scale(1.08)" : "scale(1)",
              boxShadow: btnHover
                ? "0 12px 30px rgba(249,115,22,0.7)"
                : "none",
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Send Message
          </button>
        </div>

      </div>
    </section>
  );
};

/* ===== STYLES ===== */

const section = {
  width: "100%",
  background: "#fff7ed",
  padding: "100px 0",
  overflow: "hidden",
};

const container = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "0 40px",
  display: "grid",
  gap: "60px",
  alignItems: "start",
};

const left = {};

const tag = {
  color: "#2563eb",
  fontWeight: "700",
  letterSpacing: "2px",
  fontSize: "13px",
};

const title = {
  fontSize: "clamp(32px, 4vw, 44px)",
  fontWeight: "800",
  margin: "20px 0",
  color: "#0f172a",
};

const desc = {
  color: "#555",
  lineHeight: "1.9",
  fontSize: "15px",
};

const cities = {
  display: "flex",
  marginTop: "30px",
};

const list = {
  listStyle: "none",
  padding: 0,
  fontWeight: "600",
  color: "#0f172a",
};

/* FORM */
const formBox = {
  background: "linear-gradient(145deg, #020617, #0f172a)",
  padding: "40px",
  borderRadius: "18px",
};

const formTitle = {
  color: "#fff",
  fontSize: "28px",
  marginBottom: "20px",
};

const row = {
  display: "flex",
  gap: "20px",
};

const input = {
  flex: 1,
  padding: "14px",
  border: "none",
  outline: "none",
  borderRadius: "8px",
};

const inputFull = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  border: "none",
  outline: "none",
  borderRadius: "8px",
};

const textarea = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  border: "none",
  outline: "none",
  resize: "none",
  borderRadius: "8px",
};

const btn = {
  marginTop: "20px",
  background: "linear-gradient(135deg, #f97316, #fb923c)",
  color: "#fff",
  border: "none",
  padding: "14px 30px",
  fontWeight: "700",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default WhyUs;
