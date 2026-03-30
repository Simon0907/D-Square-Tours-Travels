import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/FamousPackageEnquiry.css";

const BASE = "http://localhost:5000/api";

const vehicles = [
  { name: "Mini",          rent: 1300, kmRate: 8  },
  { name: "Sedan",         rent: 1500, kmRate: 9  },
  { name: "Etios",         rent: 1500, kmRate: 9  },
  { name: "SUV (Tavera)",  rent: 2000, kmRate: 11 },
  { name: "SUV (Ertiga)",  rent: 1900, kmRate: 11 },
  { name: "SUV (Innova)",  rent: 2200, kmRate: 12 },
  { name: "SUV (Crysta)",  rent: 2500, kmRate: 16 },
  { name: "Tempo",         rent: 2600, kmRate: 16 },
  { name: "Coach AC",      rent: 5500, kmRate: 25 },
  { name: "Coach Non AC",  rent: 3600, kmRate: 17 },
];

const TOTAL_KM      = 1100;
const DAYS          = 5;
const EXTRA_CHARGES = 2500;
const today         = new Date().toISOString().split("T")[0];

const FamousPackageEnquiry = () => {
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalAmount,     setTotalAmount]     = useState(0);
  const [submitting,      setSubmitting]      = useState(false);

  const [form, setForm] = useState({
    name:            "",
    phone:           "",
    pickupLocation:  "",
    numberOfPersons: "",
    address:         "",
    travelDate:      "",
    travelTime:      "",
    returnDate:      "",
  });

  const [error, setError] = useState("");

  const handleVehicleChange = (e) => {
    const vehicle = vehicles.find((v) => v.name === e.target.value);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setTotalAmount(vehicle.rent * DAYS + vehicle.kmRate * TOTAL_KM + EXTRA_CHARGES);
    } else {
      setSelectedVehicle(null);
      setTotalAmount(0);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const minReturn = form.travelDate
    ? new Date(new Date(form.travelDate).getTime() + 86400000).toISOString().split("T")[0]
    : today;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.pickupLocation ||
        !form.numberOfPersons || !form.travelDate || !form.travelTime ||
        !form.returnDate || !selectedVehicle) {
      setError("Please fill all required fields and select a vehicle.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // ── POST to backend — no login needed ───────────────────────────────────
      const res = await fetch(`${BASE}/famous-bookings`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer:        form.name,
          phone:           form.phone,
          address:         form.address,
          pickupLocation:  form.pickupLocation,
          numberOfPersons: form.numberOfPersons,
          travelDate:      form.travelDate,
          travelTime:      form.travelTime,
          returnDate:      form.returnDate,
          vehicle:         selectedVehicle.name,
          vehicleRent:     selectedVehicle.rent,
          kmRate:          selectedVehicle.kmRate,
          totalKm:         TOTAL_KM,
          days:            DAYS,
          extraCharges:    EXTRA_CHARGES,
          amount:          totalAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Booking failed. Please try again.");
        return;
      }

      alert(
        `✅ Famous Package Booked!\n\nPackage: 5 Days Round Trip\nTravel: ${form.travelDate} at ${form.travelTime}\nReturn: ${form.returnDate}\nVehicle: ${selectedVehicle.name}\nTotal: ₹${totalAmount.toLocaleString()}\n\nThank you, ${form.name}!\nBooking ID: ${data.booking?.bookingId || ""}`
      );

      navigate("/packages");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "";

  return (
    <div className="fpe-page">
      <div className="fpe-container">

        <div className="fpe-header">
          <span className="fpe-badge">⭐ Famous Package</span>
          <h1>5 Days Round Trip</h1>
          <p className="fpe-route">📍 Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram</p>
          <div className="fpe-tags">
            <span>🗓 {DAYS} Days</span>
            <span>🛣 {TOTAL_KM} KM</span>
            <span>🎫 Toll + Parking Included</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="fpe-form">

          {/* Vehicle Selection */}
          <div className="fpe-section">
            <h3><span className="sec-icon">🚗</span> Select Vehicle</h3>
            <div className="fpe-field">
              <label>Vehicle Type <span className="req">*</span></label>
              <select onChange={handleVehicleChange} required>
                <option value="">Choose your vehicle</option>
                {vehicles.map((v, i) => (
                  <option key={i} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            {selectedVehicle && (
              <div className="fpe-breakdown">
                <h4>💰 Price Breakdown</h4>
                <div className="breakdown-rows">
                  <div className="brow">
                    <span>Vehicle Rent (₹{selectedVehicle.rent} × {DAYS} days)</span>
                    <span>₹{(selectedVehicle.rent * DAYS).toLocaleString()}</span>
                  </div>
                  <div className="brow">
                    <span>KM Charge (₹{selectedVehicle.kmRate} × {TOTAL_KM} km)</span>
                    <span>₹{(selectedVehicle.kmRate * TOTAL_KM).toLocaleString()}</span>
                  </div>
                  <div className="brow">
                    <span>Toll + Parking + Permit</span>
                    <span>₹{EXTRA_CHARGES.toLocaleString()}</span>
                  </div>
                  <div className="brow brow-total">
                    <span>Total Amount</span>
                    <span className="brow-price">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Travel Date & Time */}
          <div className="fpe-section">
            <h3><span className="sec-icon">🗓</span> Travel Date & Time</h3>
            <div className="fpe-grid-3">
              <div className="fpe-field">
                <label>Travel Start Date <span className="req">*</span></label>
                <input type="date" name="travelDate" value={form.travelDate}
                  onChange={handleChange} min={today} required className="date-input" />
              </div>
              <div className="fpe-field">
                <label>Pickup Time <span className="req">*</span></label>
                <input type="time" name="travelTime" value={form.travelTime}
                  onChange={handleChange} required className="date-input" />
              </div>
              <div className="fpe-field">
                <label>Return Date <span className="req">*</span></label>
                <input type="date" name="returnDate" value={form.returnDate}
                  onChange={handleChange} min={minReturn} required className="date-input" />
              </div>
            </div>
            {form.travelDate && form.travelTime && form.returnDate && (
              <div className="fpe-date-summary">
                <span>📅</span>
                <span>
                  Pickup on <strong>{fmt(form.travelDate)}</strong> at{" "}
                  <strong>{form.travelTime}</strong> → Return on{" "}
                  <strong>{fmt(form.returnDate)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="fpe-section">
            <h3><span className="sec-icon">👤</span> Customer Details</h3>
            <div className="fpe-grid-2">
              <div className="fpe-field">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" name="name" placeholder="Your full name"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="fpe-field">
                <label>Phone Number <span className="req">*</span></label>
                <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX"
                  value={form.phone} onChange={handleChange} required />
              </div>
              <div className="fpe-field">
                <label>Pickup Location <span className="req">*</span></label>
                <input type="text" name="pickupLocation" placeholder="Where to pick you up"
                  value={form.pickupLocation} onChange={handleChange} required />
              </div>
              <div className="fpe-field">
                <label>No. of Persons <span className="req">*</span></label>
                <input type="number" name="numberOfPersons" placeholder="e.g. 4"
                  value={form.numberOfPersons} onChange={handleChange} min="1" required />
              </div>
            </div>
            <div className="fpe-field">
              <label>Address</label>
              <textarea name="address" placeholder="Your full address"
                value={form.address} onChange={handleChange} rows={2} />
            </div>
          </div>

          {error && <div className="fpe-error">⚠ {error}</div>}

          <div className="fpe-actions">
            <button type="button" className="fpe-cancel" onClick={() => navigate("/packages")}>
              Cancel
            </button>
            <button type="submit" className="fpe-submit" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Booking ✓"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FamousPackageEnquiry;