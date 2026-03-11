import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import "../css/PopularDestinations.css";

import amazonForest from "../assets/Madurai.jpg";
import newZealand from "../assets/kanyakumari.jpeg";
import london from "../assets/Rameshwaram.webp";
import europe from "../assets/thiruvanathapuram.webp";
import africa from "../assets/Kodaikanal.webp";

const PopularDestinations = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate(); // ✅ INIT NAVIGATE

  const destinations = [
    { id: 1, name: "Madurai", image: amazonForest, size: "large" },
    { id: 2, name: "Kanyakumari", image: newZealand, size: "large" },
    { id: 3, name: "Rameshwaram", image: london, size: "tall" },
    { id: 4, name: "Thiruvanathapuram", image: europe, size: "medium" },
    { id: 5, name: "Kodaikanal", image: africa, size: "medium" }
  ];

  return (
    <section className="destinations-section">
      <div className="destinations-container">

        {/* LEFT CONTENT */}
        <div className="destinations-header fade-in-left">
          <span className="section-badge">CHOOSE YOUR PLACE</span>
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-description">
            Join us as we explore the wonders of the globe, one incredible journey at a time.
          </p>

          {/* ✅ FIXED BUTTON */}
          <button
            className="find-packages-btn"
            onClick={() => navigate("/packages")}
          >
            Find Packages
            <span className="btn-arrow">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </span>
          </button>
        </div>

        {/* DESTINATIONS GRID */}
        <div className="destinations-grid">
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              className={`destination-card card-${dest.size} fade-in-up delay-${index + 1}`}
              onMouseEnter={() => setHoveredCard(dest.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className={`card-image ${hoveredCard === dest.id ? "zoomed" : ""}`}
              />
              <div className="card-overlay">
                <h3 className="card-title">{dest.name}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularDestinations;
