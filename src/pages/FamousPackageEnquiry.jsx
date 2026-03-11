import React, { useState } from "react";
import "../css/FamousPackageEnquiry.css";

const vehicles = [
  { name: "Mini", rent: 1300, kmRate: 8 },
  { name: "Sedan", rent: 1500, kmRate: 9 },
  { name: "Etios", rent: 1500, kmRate: 9 },
  { name: "SUV (Tavera)", rent: 2000, kmRate: 11 },
  { name: "SUV (Ertiga)", rent: 1900, kmRate: 11 },
  { name: "SUV (Innova)", rent: 2200, kmRate: 12 },
  { name: "SUV (Crysta)", rent: 2500, kmRate: 16 },
  { name: "Tempo", rent: 2600, kmRate: 16 },
  { name: "Coach AC", rent: 5500, kmRate: 25 },
  { name: "Coach Non AC", rent: 3600, kmRate: 17 }
];

const TOTAL_KM = 1100;
const DAYS = 5;
const EXTRA_CHARGES = 2500;

const FamousPackageEnquiry = () => {

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleVehicleChange = (e) => {

    const vehicle = vehicles.find(v => v.name === e.target.value);

    if (vehicle) {

      const rentCost = vehicle.rent * DAYS;
      const kmCost = vehicle.kmRate * TOTAL_KM;

      const total = rentCost + kmCost + EXTRA_CHARGES;

      setSelectedVehicle(vehicle);
      setTotalAmount(total);
    }
  };

  return (

    <div className="package-enquiry-container">

      <h1 className="enquiry-title">
        5 Days Round Trip Package
      </h1>

      <p className="route-text">
        Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram
      </p>

      {/* VEHICLE SELECT */}

      <div className="vehicle-select-box">

        <label>Select Vehicle</label>

        <select onChange={handleVehicleChange}>
          <option>Select Vehicle</option>

          {vehicles.map((v, index) => (
            <option key={index} value={v.name}>
              {v.name}
            </option>
          ))}

        </select>

      </div>


      {/* PRICE BREAKDOWN */}

      {selectedVehicle && (

        <div className="price-breakdown">

          <h3>Package Calculation</h3>

          <p>Vehicle Rent ({selectedVehicle.rent} × {DAYS} days)</p>
          <p>KM Charge ({selectedVehicle.kmRate} × {TOTAL_KM} km)</p>
          <p>Toll + Parking + Permit : ₹2500</p>

          <h2>Total Amount : ₹{totalAmount}</h2>

        </div>

      )}


      {/* CUSTOMER FORM */}

      <div className="customer-form">

        <h3>Customer Details</h3>

        <input type="text" placeholder="Full Name" />

        <input type="tel" placeholder="Phone Number" />

        <input type="text" placeholder="Pickup Location" />

        <input type="number" placeholder="No. of Persons" />

        <textarea placeholder="Address"></textarea>

        <button className="enquiry-btn">
          Book Now
        </button>

      </div>

    </div>
  );
};

export default FamousPackageEnquiry;