import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TravelAbout.css";

/* ✅ IMPORT IMAGE FROM ASSETS */
import AboutImage from "../assets/about-travel.png";

const TravelAbout = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const features = [
    "Budget-Friendly",
    "Luxurious Getaways",
    "Trusted Local Guides",
  ];

  return (
    <section className="travel-about">
      <div className="travel-container">

        {/* ✅ IMAGE SECTION */}
        <div className="about-image-wrapper fade-in-left">
          <img
            src={AboutImage}
            alt="South India Travel Experience"
            className="about-main-image"
          />
        </div>

        {/* ✅ CONTENT SECTION */}
        <div className="content-wrapper">
          <span className="about-badge fade-in-up">ABOUT US</span>

          <h1 className="main-title fade-in-up delay-1">
            Your Journey, Our Passion
          </h1>

          <p className="description fade-in-up delay-2">
            We believe that travel is more than just visiting new places; it's about
            creating memories, experiencing diverse cultures, and discovering the
            wonders of the world.
          </p>

          <ul className="features-list fade-in-up delay-3">
            {features.map((feature, index) => (
              <li key={index} className="feature-item">✔ {feature}</li>
            ))}
          </ul>

          <button
            className={`learn-more-btn ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate("/about")}
          >
            Learn More →
          </button>

          <div className="rating-section fade-in-up delay-4">
            ⭐ <strong>4.7 Star Rating</strong>
            <span> — Based on 3,571 Reviews</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TravelAbout;
