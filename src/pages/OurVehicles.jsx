import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/OurVehicles.css";

/* IMPORT VEHICLE IMAGES */

import mini from "../assets/cars/mini.jpg";
import sedan from "../assets/cars/saden.webp";
import etios from "../assets/cars/Etios.jpg";
import tavera from "../assets/cars/tavera.png";
import ertiga from "../assets/cars/Ertiga.jpg";
import innova from "../assets/cars/innova.jpg";
import crysta from "../assets/cars/Innova_Crysta.jpg";
import tempo from "../assets/cars/tempo.jpg";
import coachAC from "../assets/cars/coach.webp";
import coachNonAC from "../assets/cars/coach.webp";

const TariffPackages = () => {
  const navigate = useNavigate();

  const vehicles = [
    {
      name: "Mini",
      image: mini,
      belowKm: 250,
      aboveKm: 250,
      rentPerDay: "₹1300/-",
      fuelChargeBelowKm: "₹8/-",
      perDayKm: "₹11/-",
      driverBetta: "₹200/-",
    },
    {
      name: "Sedan",
      image: sedan,
      belowKm: 250,
      aboveKm: 250,
      rentPerDay: "₹1500/-",
      fuelChargeBelowKm: "₹9/-",
      perDayKm: "₹12/-",
      driverBetta: "₹200/-",
    },
    {
      name: "Etios",
      image: etios,
      belowKm: 250,
      aboveKm: 250,
      rentPerDay: "₹1500/-",
      fuelChargeBelowKm: "₹9/-",
      perDayKm: "₹13/-",
      driverBetta: "₹200/-",
    },
    {
      name: "SUV (Tavera A/C)",
      image: tavera,
      belowKm: 300,
      aboveKm: 300,
      rentPerDay: "₹2000/-",
      fuelChargeBelowKm: "₹11/-",
      perDayKm: "₹16/-",
      driverBetta: "₹300/-",
    },
    {
      name: "SUV (Ertiga / Rumion)",
      image: ertiga,
      belowKm: 300,
      aboveKm: 300,
      rentPerDay: "₹1900/-",
      fuelChargeBelowKm: "₹11/-",
      perDayKm: "₹16/-",
      driverBetta: "₹300/-",
    },
    {
      name: "SUV (Innova A/C)",
      image: innova,
      belowKm: 300,
      aboveKm: 300,
      rentPerDay: "₹2200/-",
      fuelChargeBelowKm: "₹12/-",
      perDayKm: "₹16/-",
      driverBetta: "₹300/-",
    },
    {
      name: "SUV (Innova Crysta)",
      image: crysta,
      belowKm: 300,
      aboveKm: 300,
      rentPerDay: "₹2500/-",
      fuelChargeBelowKm: "₹16/-",
      perDayKm: "₹21/-",
      driverBetta: "₹400/-",
    },
    {
      name: "Tempo",
      image: tempo,
      belowKm: 350,
      aboveKm: 350,
      rentPerDay: "₹2600/-",
      fuelChargeBelowKm: "₹16/-",
      perDayKm: "₹22/-",
      driverBetta: "₹500/-",
    },
    {
      name: "21 Seater Coach A/C",
      image: coachAC,
      belowKm: 350,
      aboveKm: 350,
      rentPerDay: "₹5500/-",
      fuelChargeBelowKm: "₹25/-",
      perDayKm: "₹31/-",
      driverBetta: "₹600/-",
    },
    {
      name: "21 Seater Coach Non A/C",
      image: coachNonAC,
      belowKm: 350,
      aboveKm: 350,
      rentPerDay: "₹3600/-",
      fuelChargeBelowKm: "₹17/-",
      perDayKm: "₹24/-",
      driverBetta: "₹500/-",
    },
  ];

  const handleBookNow = (vehicle) => {
    navigate("/vehiclesbooking", {
      state: { vehicle },
    });
  };

  return (
    <div className="tariff-packages">

      <div className="header-section">
        <div className="section-label">
          <span className="label-line"></span>
          <span className="label-text">OUR VEHICLE</span>
        </div>

        <h1 className="main-title">Tariff Packages</h1>

        <p className="description">
          Vismi Cabs offers competitive and transparent tariff plans for local,
          outstation, and tour packages across South India. Choose from a range
          of vehicles like Sedans, SUVs, and Tempo Travellers to suit your
          travel needs and budget.
        </p>

        <div className="extra-charges-badge">
          Extra : Tollgate, Parking, Hills Charges
        </div>
      </div>

      <div className="vehicles-grid">

        {vehicles.map((vehicle, index) => (
          <div
            className="vehicle-card"
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="vehicle-image-container">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="vehicle-image"
              />
            </div>

            <h3 className="vehicle-name">{vehicle.name}</h3>

            <div className="pricing-section">

              <h4 className="pricing-tier">
                Below {vehicle.belowKm} km (Per Day)
              </h4>

              <div className="price-row">
                <span className="price-label">Rent Per Day:</span>
                <span className="price-value">{vehicle.rentPerDay}</span>
              </div>

              <div className="price-row">
                <span className="price-label">Fuel Charge Per km:</span>
                <span className="price-value">{vehicle.fuelChargeBelowKm}</span>
              </div>

              <h4 className="pricing-tier">
                Above {vehicle.aboveKm} km (Per Day)
              </h4>

              <div className="price-row">
                <span className="price-label">Per Day km:</span>
                <span className="price-value">{vehicle.perDayKm}</span>
              </div>

              <div className="price-row">
                <span className="price-label">Driver Betta:</span>
                <span className="price-value">{vehicle.driverBetta}</span>
              </div>

            </div>

            <button
              className="book-now-btn"
              onClick={() => handleBookNow(vehicle)}
            >
              Book Now
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default TariffPackages;