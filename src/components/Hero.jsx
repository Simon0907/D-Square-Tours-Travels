import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hero.css";

/* ✅ IMPORT IMAGES FROM ASSETS */
import Madurai from "../assets/Madurai.jpg";
import Kanyakumari from "../assets/kanyakumari.jpeg";
import Rameshwaram from "../assets/Rameshwaram.webp";

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  /* ✅ USE IMPORTED IMAGES */
  const images = [Madurai, Kanyakumari, Rameshwaram];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero">
      {/* SLIDESHOW */}
      <div className="hero-slideshow">
        {images.map((image, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentImageIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      <div className="hero-overlay"></div>

      {/* CONTENT */}
      <div className="hero-content-wrapper">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="tag-dot"></span>
            EXPERIENCE LUXURY TRAVEL
          </div>

          <h1 className="hero-title">
            Explore <br />
            TamilNadu <br />
            Like Never Before
          </h1>

          <p className="hero-desc">
            Curated journeys to the most breathtaking destinations of Tamil Nadu.
            Let us transform your travel dreams into unforgettable memories.
          </p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/packages")}
            >
              <span>Explore Tours</span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/about")}
            >
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </div>

      {/* SLIDE INDICATORS */}
      <div className="hero-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? "active" : ""}`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* SCROLL INDICATOR */}
      <div className="hero-scroll-indicator">
        <div className="scroll-icon">
          <span></span>
        </div>
        <p>Scroll to explore</p>
      </div>
    </section>
  );
};

export default Hero;
