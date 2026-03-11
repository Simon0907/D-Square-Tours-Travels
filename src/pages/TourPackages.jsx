import { useNavigate } from "react-router-dom";
import "../css/Package.css";

import madurai from "../assets/Madurai.jpg";
import rameshwaram from "../assets/Rameshwaram.webp";
import kanyakumari from "../assets/kanyakumari.jpeg";
import trivandrum from "../assets/thiruvanathapuram.webp";
import alleppey from "../assets/kerala-famous.jpg";
import cochin from "../assets/cochin.jpg";
import munnar from "../assets/munnar.avif";
import kodaikanal from "../assets/Kodaikanal.webp";
import thekkady from "../assets/thekkady.jpg";
import ooty from "../assets/ooty.jpg";
import coimbatore from "../assets/coimbatore.jpg";

const packages = [
  {
    id: 1,
    title: "Madurai Tour Packages",
    img: madurai,
    desc: "Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum."
  },
  {
    id: 2,
    title: "Rameswaram Tour Packages",
    img: rameshwaram,
    desc: "Ramanathaswamy Temple, Agni Theertham, Dhanushkodi Beach."
  },
  {
    id: 3,
    title: "Kanyakumari Tour Packages",
    img: kanyakumari,
    desc: "Vivekananda Rock Memorial, Thiruvalluvar Statue, Sunset View Point."
  },
  {
    id: 4,
    title: "Trivandrum Tour Packages",
    img: trivandrum,
    desc: "Padmanabhaswamy Temple, Kovalam Beach."
  },
  {
    id: 5,
    title: "Alleppey Tour Packages",
    img: alleppey,
    desc: "Alleppey Backwaters, Houseboat Cruise."
  },
  {
    id: 6,
    title: "Cochin Tour Packages",
    img: cochin,
    desc: "Fort Kochi Beach, Chinese Fishing Nets."
  },
  {
    id: 7,
    title: "Munnar Tour Packages",
    img: munnar,
    desc: "Tea Museum, Eravikulam National Park."
  },
  {
    id: 8,
    title: "Kodaikanal Tour Packages",
    img: kodaikanal,
    desc: "Kodaikanal Lake, Coaker's Walk."
  },
  {
    id: 9,
    title: "Thekkady Tour Packages",
    img: thekkady,
    desc: "Periyar Wildlife Sanctuary."
  },
  {
    id: 10,
    title: "Ooty Tour Packages",
    img: ooty,
    desc: "Ooty Lake, Botanical Garden."
  },
  {
    id: 11,
    title: "Coimbatore Tour Packages",
    img: coimbatore,
    desc: "Isha Yoga Center, Marudamalai Temple."
  }
];

const Packages = () => {

  const navigate = useNavigate();

  /* NAVIGATION FOR NORMAL PACKAGES */

  const handlePackageEnquiry = (pkg) => {
    navigate("/package-enquiry", {
      state: { packageData: pkg }
    });
  };

  /* NAVIGATION FOR FAMOUS PACKAGE */

  const handleFamousPackage = () => {
    navigate("/famous-package");
  };

  return (
    <>

    {/* FAMOUS PACKAGE */}

      <section className="custom-package-section">

        <h2 className="packages-title">Our Famous Package</h2>

        <p className="packages-subtitle">
          Explore your dream trip across South India's most beautiful destinations.
        </p>

        <div className="packages-grid">

          <div className="package-card">

            <div className="image-container">

              <img src={madurai} alt="5 Days Round Trip" />

              <span className="package-label">
                CUSTOM PACKAGE
              </span>

              <div className="book-now-overlay">

                <button
                  className="book-now-btn"
                  onClick={handleFamousPackage}
                >
                  Book Now
                </button>

              </div>

            </div>

            <div className="package-content">

              <h3>5 Days Round Trip</h3>

              <p>
                Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* NORMAL PACKAGES */}

      <section className="packages-section">

        <h1 className="packages-title">Exploring Tour Packages</h1>

        <p className="packages-subtitle">
          Explore curated travel packages across Tamil Nadu and Kerala.
        </p>

        <div className="packages-grid">

          {packages.map((pkg) => (

            <div className="package-card" key={pkg.id}>

              <div className="image-container">

                <img src={pkg.img} alt={pkg.title} />

                <span className="package-label">
                  PACKAGE {pkg.id}
                </span>

                <div className="book-now-overlay">

                  <button
                    className="book-now-btn"
                    onClick={() => handlePackageEnquiry(pkg)}
                  >
                    Book Now
                  </button>

                </div>

              </div>

              <div className="package-content">
                <h3>{pkg.title}</h3>
                <p>{pkg.desc}</p>
              </div>

            </div>

          ))}

        </div>

      </section>


      

    </>
  );
};

export default Packages;