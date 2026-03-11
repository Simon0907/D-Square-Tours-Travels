import { useEffect, useState, useRef } from 'react';
import "../css/About.css";



const About = () => {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-pill animate-fade-in">ABOUT US</span>

          <h1 className="hero-title animate-slide-up">
            Established with a passion <br /> for exploration
          </h1>

          <div className="stats-container animate-slide-up-delayed">
            <AnimatedStat value={10} label="Years of Experience" suffix="+" />
            <AnimatedStat value={500} label="Destinations" suffix="+" />
            <AnimatedStat value={24} label="Customer Support" suffix="/7+" />
            <AnimatedStat value={98} label="Happy Clients" suffix="%" />
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse"></div>
        </div>
      </section>

      {/* ===== ABOUT CONTENT ===== */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-text reveal-left">
            <span className="section-label">WELCOME TO</span>
            <h2 className="about-title">About D Square Tours & Travles</h2>

            <p className="about-paragraph">
              D Square Tours & Travels offers a wide selection of tour packages designed to
              showcase the beauty and cultural richness of South India. We
              specialize in Kerala Tour Packages, perfect for
              exploring lush landscapes, historical sites, and coastal beauty.
            </p>

            <p className="about-paragraph">
              Our South India Tour Packages cover multiple states, giving you a
              comprehensive travel experience across the region. For spiritual
              travelers, we offer All Temple Tour Packages including famous
              pilgrimage sites across Tamil Nadu and beyond.
            </p>

            <p className="about-paragraph">
              Additionally, we provide tailored Madurai Local Tour Packages,
              ideal for discovering the city's iconic temples, heritage spots,
              and vibrant markets. With D Square Tours & Travels, you get a comfortable,
              reliable, and enriching travel experience wherever you go.
            </p>
          </div>

          <div className="about-image-wrapper reveal-right">
            <div className="image-overlay"></div>
            <img
              src="https://cdn.audleytravel.com/-/-/79/1340848-meenakshi-temple.jpg"
              alt="Madurai Temple"
              className="about-image"
            />
          </div>
        </div>
      </section>
    </>
  );
};

/* ===== ANIMATED STAT COMPONENT ===== */
const AnimatedStat = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const statRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => {
      if (statRef.current) {
        observer.unobserve(statRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={statRef} className="stat-card">
      <h3 className="stat-value">
        {count}{suffix}
      </h3>
      <p className="stat-label">{label}</p>
    </div>
  );
};

export default About;
