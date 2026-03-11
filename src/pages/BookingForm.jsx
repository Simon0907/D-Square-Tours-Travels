import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingForm.css";

function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const packageData = location.state?.packageData;

  useEffect(() => {
    if (!packageData) {
      navigate("/packages");
    }
  }, [packageData, navigate]);

  if (!packageData) return null;

  const vehicles = [
    { name: "Mini", rentPerDay: 1300 },
    { name: "Sedan", rentPerDay: 1500 },
    { name: "Etios", rentPerDay: 1600 },
    { name: "SUV (Tavera)", rentPerDay: 1800 },
    { name: "SUV (Innova)", rentPerDay: 2200 },
    { name: "SUV (Innova Crysta)", rentPerDay: 2600 },
    { name: "Tempo", rentPerDay: 2600 },
    { name: "21 Seater Coach", rentPerDay: 5500 }
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    numberOfPersons: "",
    pickupLocation: "",
    vehicle: "",
    acType: "AC",
    specialRequests: ""
  });

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "vehicle" || name === "acType") {
      calculateAmount(
        name === "vehicle" ? value : formData.vehicle,
        name === "acType" ? value : formData.acType
      );
    }
  };

  const calculateAmount = (vehicleName, acType) => {
    if (!vehicleName) {
      setCalculatedAmount(0);
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.name === vehicleName);
    if (!selectedVehicle) {
      setCalculatedAmount(0);
      return;
    }

    let basePrice = parseInt(
      packageData.price.replace("₹", "").replace(/,/g, "")
    );
    let vehicleCharge = selectedVehicle.rentPerDay;

    if (acType === "Non-AC") {
      vehicleCharge = vehicleCharge * 0.85;
    }

    setCalculatedAmount(basePrice + vehicleCharge);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.numberOfPersons ||
      !formData.vehicle
    ) {
      alert("Please fill all required fields");
      return;
    }

    const bookingData = {
      ...formData,
      packageTitle: packageData.title,
      packagePrice: packageData.price,
      totalAmount: calculatedAmount,
      date: new Date().toLocaleDateString()
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    existingBookings.push(bookingData);
    localStorage.setItem("bookings", JSON.stringify(existingBookings));

    alert(
      `Booking Confirmed!\n\nPackage: ${packageData.title}\nTotal: ₹${calculatedAmount.toLocaleString()}\n\nThank you ${formData.name}!`
    );

    navigate("/packages");
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="form-header">
          <h2>Book Your Tour</h2>
          <p className="package-title">{packageData.title}</p>
          <p className="package-duration">{packageData.duration}</p>
          <p className="package-price">Base Package Price: {packageData.price}</p>
        </div>

        <div className="itinerary-section">
          <h3 className="itinerary-title">Tour Itinerary</h3>

          {packageData.itinerary && (
            <div className="simple-itinerary">
              <h4>Places to Visit:</h4>
              <ul className="places-list">
                {packageData.itinerary.map((place, index) => (
                  <li key={index}>{place}</li>
                ))}
              </ul>
            </div>
          )}

          {packageData.detailedItinerary && (
            <div className="detailed-itinerary">
              {packageData.detailedItinerary.map((dayInfo, index) => (
                <div key={index} className="day-card">
                  <div className="day-header">
                    <span className="day-number">{dayInfo.day}</span>
                    <h4 className="day-title">{dayInfo.title}</h4>
                  </div>
                  <ul className="day-activities">
                    {dayInfo.activities.map((activity, actIndex) => (
                      <li key={actIndex}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-section">
            <h3>Customer Details</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-section">
            <h3>Trip Details</h3>
            <input
              type="number"
              name="numberOfPersons"
              placeholder="Number of Persons *"
              value={formData.numberOfPersons}
              onChange={handleInputChange}
              min="1"
              required
            />
            <input
              type="text"
              name="pickupLocation"
              placeholder="Pickup Location *"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-section">
            <h3>Vehicle Selection</h3>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose Vehicle *</option>
              {vehicles.map((v, index) => (
                <option key={index} value={v.name}>
                  {v.name} - ₹{v.rentPerDay}/day
                </option>
              ))}
            </select>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="acType"
                  value="AC"
                  checked={formData.acType === "AC"}
                  onChange={handleInputChange}
                />
                AC
              </label>
              <label>
                <input
                  type="radio"
                  name="acType"
                  value="Non-AC"
                  checked={formData.acType === "Non-AC"}
                  onChange={handleInputChange}
                />
                Non-AC
              </label>
            </div>

            <textarea
              name="specialRequests"
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={handleInputChange}
            />
          </div>

          {formData.vehicle && (
            <div className="amount-section">
              <p>Package Price: {packageData.price}</p>
              <p>
                Vehicle Charge: ₹
                {vehicles
                  .find((v) => v.name === formData.vehicle)
                  ?.rentPerDay.toLocaleString()}
              </p>
              <h3>Total: ₹{calculatedAmount.toLocaleString()}</h3>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/packages")}>
              Cancel
            </button>
            <button type="submit" className="book-now-btn">
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
