import { useEffect, useRef, useState } from 'react';
import "../css/Service.css"

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>


      <section
        ref={sectionRef}
        style={{
          width: '100%',
          padding: '80px 0',
          background: 'linear-gradient(135deg, #ed7c0a, #e1750a) 100%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2
              className={`heading-title ${isVisible ? '' : 'opacity-0'}`}
              style={{
                fontSize: '56px',
                fontWeight: '800',
                marginBottom: '24px',
                animation: isVisible ? 'fadeInScale 0.8s ease-out 0.1s forwards' : 'none',
                letterSpacing: '-1px',
              }}
            >
              Our Exploring Cab Services
            </h2>
            <p
              style={{
                maxWidth: '800px',
                margin: '0 auto 40px',
                fontSize: '18px',
                lineHeight: '1.8',
                color: '#555',
                animation: isVisible ? 'slideInLeft 0.8s ease-out 0.3s forwards' : 'none',
                opacity: isVisible ? 1 : 0,
              }}
            >
              D Square Tours & Travels offers TamilNadu ,Kerala and complete South India tour
              packages for a memorable travel experience. We also provide all major
              temple tours and customized Madurai local tour packages. Enjoy
              comfortable rides, expert drivers, and affordable pricing for every
              journey.
            </p>
          </div>

          {/* GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {services.map((item, index) => (
              <div
                key={index}
                className={`service-card ${isVisible ? 'visible' : ''}`}
                style={{
                  animationDelay: `${0.5 + index * 0.1}s`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="service-image"
                    style={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                      pointerEvents: 'none',
                    }}
                  ></div>
                </div>

                <div
                  className={`service-content ${item.highlight ? 'highlight-card' : ''}`}
                  style={{
                    position: 'relative',
                    marginTop: '-50px',
                    padding: '25px',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                    background: item.highlight ? undefined : '#ffffff',
                    color: item.highlight ? '#333' : '#333',
                    zIndex: 10,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      color: item.highlight ? '#333' : '#222',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: item.highlight ? '#444' : '#666',
                      marginBottom: '16px',
                    }}
                  >
                    {item.desc}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: item.highlight ? '#333' : '#667eea',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.gap = '12px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.gap = '8px';
                    }}
                  >
                    
                    <svg
                      style={{
                        width: '16px',
                        height: '16px',
                        transition: 'transform 0.3s ease',
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const services = [
  {
    title: "Local Packages",
    desc: "Enjoy convenient & affordable price Local Packages with D Square Tours & Travels for city tourist places, daily travel needs.",
    image: "https://www.revv.co.in/blogs/wp-content/uploads/2020/07/Thanjavur-Image.jpg",
    highlight: false,
  },
  {
    title: "Outstation Tours",
    desc: "Experience comfortable & reliable Outstation Tours with D Square Tours & Travels for seamless travel to nearby tourist places.",
    image: "https://images.pexels.com/photos/464327/pexels-photo-464327.jpeg?cs=srgb&dl=landscape-nature-water-464327.jpg&fm=jpg",
    highlight: true,
  },
  {
    title: "Tour Packages",
    desc: "Discover customized Tour Packages with D Square Tours & Travels, covering popular destinations for a memorable & hassle-free journey.",
    image: "https://images.squarespace-cdn.com/content/v1/5adf25b575f9ee4695083a1a/1705492838381-NZNU4S5404X48TQ0G039/image-asset.jpeg",
    highlight: false,
  },
  {
    title: "Group Tour Packages",
    desc: "Perfect for families, friends, and corporate outings with well-organized group tour experiences.",
    image: "https://www.otherwayround.travel/wp-content/uploads/2023/01/mexico-group-tour-other-way-round-travel.jpg",
    highlight: false,
  },
  {
    title: "Temple Tourism",
    desc: "Explore the spiritual heritage of South India with expert-guided Temple Tourism packages.",
    image: "https://cdn.audleytravel.com/-/-/79/1340848-meenakshi-temple.jpg",
    highlight: true,
  },
  {
    title: "Airport Pickup & Drop",
    desc: "Reliable Airport Pickup & Drop services ensuring timely transfers with professional drivers.",
    image: "https://gbdmagazine.com/wp-content/uploads/2024/09/Future-Proofing-Airports-MCO-Curbsideat-Dusk-1134-MRP.jpg",
    highlight: false,
  },
];

export default Services;
