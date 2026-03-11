import '../css/Contact.css';

const Contact = () => {
  return (
    <>
      

      <section className="contact-section">
        <div className="section-header">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">We're here to help you plan your perfect journey</p>
          <div className="title-divider"></div>
        </div>

        <div className="contact-container">
          <div className="info-box">
            <h2 className="info-main-title">Get In Touch</h2>
            <div className="title-underline"></div>
            <p className="info-description">
              Reach out to us for bookings, inquiries, or any assistance. We're available 24/7 to serve you.
            </p>

            <InfoItem
              title="Address"
              text="PRC Nagar, Aruldaspuram, Madurai – 625018, Tamilnadu, India."
              icon="📍"
            />
            <InfoItem
              title="Phone Number"
              text="+91 95666 26109"
              icon="📞"
            />
            <InfoItem
              title="Email"
              text="dsquaretourtravles@gmail.com"
              icon="✉️"
            />
            <InfoItem
              title="Website"
              text="www.dsquaretourstravels.com"
              icon="🌐"
            />
          </div>

          <div className="highlight-box">
            <div className="premium-badge">Premium Service</div>

            <h2 className="highlight-title">Why Travel With D Square?</h2>
            <p className="highlight-subtitle">
              We provide safe, affordable and comfortable travel experiences across Tamil Nadu.
            </p>

            <div className="feature-list">
              <FeatureItem icon="🚗" text="Well Maintained Vehicles" />
              <FeatureItem icon="👨‍✈️" text="Experienced Drivers" />
              <FeatureItem icon="💰" text="Affordable Pricing" />
              <FeatureItem icon="🕒" text="24/7 Customer Support" />
              <FeatureItem icon="🛡️" text="Fully Insured" />
              <FeatureItem icon="⭐" text="5-Star Rated Service" />
            </div>

            <div className="cta-buttons">
              <a href="tel:+917904754364" className="cta-btn call-btn">
                📞 Call Now
              </a>

              <a
                href="https://wa.me/917904754364"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn whatsapp-btn"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <h2 className="map-title">Find Us Here</h2>
        <div className="map-wrapper">
          <iframe
            title="Madurai Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.4081003547994!2d78.0670342753482!3d9.899927890200424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00cfb20b0d1c23%3A0x66a2800fb8eeea5f!2sMuniyaandipuram%201st%20St%2C%20Kala%20Malai%2C%20Pasumalai%2C%20Tamil%20Nadu%20625004!5e0!3m2!1sen!2sin!4v1771259822457!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            className="map-iframe"
          ></iframe>
        </div>
      </section>
    </>
  );
};

const InfoItem = ({ title, text, icon }) => (
  <div className="info-item">
    <div className="info-icon">{icon}</div>
    <div className="info-content">
      <h4 className="info-title">{title}</h4>
      <p className="info-text">{text}</p>
    </div>
  </div>
);

const FeatureItem = ({ icon, text }) => (
  <div className="feature-item">
    <span className="feature-icon">{icon}</span>
    <span>{text}</span>
  </div>
);

export default Contact;
