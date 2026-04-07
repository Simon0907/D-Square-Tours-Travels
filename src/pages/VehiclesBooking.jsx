import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/VehiclesBooking.css";

const BASE = "https://d-square-tours-travels.onrender.com/api";
const today = new Date().toISOString().split("T")[0];

const VehiclesBooking = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const vehicle   = location.state?.vehicle;

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", address: "",
    pickupLocation: "", dropLocation: "", noOfPersons: "",
    travelDate: "", travelTime: "", returnDate: "",
    tripType: "One Way", specialRequest: "",
  });

  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const minReturn = formData.travelDate
    ? new Date(new Date(formData.travelDate).getTime() + 86400000).toISOString().split("T")[0]
    : today;

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "";

  // ── Redirect after booking based on login status ──────────────────────────
  const redirectAfterBooking = () => {
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user?._id && user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.travelDate || !formData.travelTime) {
      setError("Please select travel date and pickup time.");
      return;
    }
    if (formData.tripType === "Round Trip" && !formData.returnDate) {
      setError("Please select return date for round trip.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/vehicle-bookings`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:           formData.name,
          phone:          formData.phone,
          email:          formData.email,
          address:        formData.address,
          pickupLocation: formData.pickupLocation,
          dropLocation:   formData.dropLocation,
          noOfPersons:    formData.noOfPersons,
          travelDate:     formData.travelDate,
          travelTime:     formData.travelTime,
          returnDate:     formData.tripType === "Round Trip" ? formData.returnDate : null,
          tripType:       formData.tripType,
          specialRequest: formData.specialRequest,
          vehicle: {
            name:              vehicle?.name,
            rentPerDay:        vehicle?.rentPerDay,
            fuelChargeBelowKm: vehicle?.fuelChargeBelowKm,
            driverBetta:       vehicle?.driverBetta,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Booking failed. Please try again.");
        return;
      }

      alert(
        `✅ Vehicle Booked!\n\nVehicle: ${vehicle?.name}\nTrip: ${formData.tripType}\nTravel: ${formData.travelDate} at ${formData.travelTime}${formData.returnDate ? `\nReturn: ${formData.returnDate}` : ""}\n\nThank you, ${formData.name}!\nBooking ID: ${data.booking?.bookingId || ""}${formData.email ? "\n\nConfirmation sent to your email." : ""}`
      );

      redirectAfterBooking();
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!vehicle) {
    return (
      <div style={{ padding:"3rem", textAlign:"center" }}>
        <p>No vehicle selected.</p>
        <button onClick={() => navigate("/ourvehicles")}
          style={{ marginTop:"1rem", padding:"0.5rem 1.5rem" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="vb-page">
      <div className="vb-container">

        <div className="vb-header">
          <span className="vb-badge">Vehicle Booking</span>
          <h1>{vehicle.name}</h1>
          <div className="vb-vehicle-info">
            <span>🚗 {vehicle.name}</span>
            <span>💰 {vehicle.rentPerDay} / day</span>
            <span>⛽ {vehicle.fuelChargeBelowKm} / km</span>
            <span>👨‍✈️ Driver Betta: {vehicle.driverBetta}</span>
          </div>
          <p className="vb-extra">Extra: Tollgate, Parking, Hills charges applicable</p>
        </div>

        <form className="vb-form" onSubmit={handleSubmit}>

          {/* Trip Type */}
          <div className="vb-section">
            <h3><span className="sec-icon">🗺</span> Trip Type</h3>
            <div className="vb-radio-group">
              {["One Way", "Round Trip", "Local"].map((t) => (
                <label key={t} className={`vb-radio ${formData.tripType === t ? "selected" : ""}`}>
                  <input type="radio" name="tripType" value={t}
                    checked={formData.tripType === t} onChange={handleChange} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Travel Date & Time */}
          <div className="vb-section">
            <h3><span className="sec-icon">🗓</span> Travel Date & Time</h3>
            <div className={`vb-grid-${formData.tripType === "Round Trip" ? "3" : "2"}`}>
              <div className="vb-field">
                <label>Travel Date <span className="req">*</span></label>
                <input type="date" name="travelDate" value={formData.travelDate}
                  onChange={handleChange} min={today} required className="date-input" />
              </div>
              <div className="vb-field">
                <label>Pickup Time <span className="req">*</span></label>
                <input type="time" name="travelTime" value={formData.travelTime}
                  onChange={handleChange} required className="date-input" />
              </div>
              {formData.tripType === "Round Trip" && (
                <div className="vb-field">
                  <label>Return Date <span className="req">*</span></label>
                  <input type="date" name="returnDate" value={formData.returnDate}
                    onChange={handleChange} min={minReturn} required className="date-input" />
                </div>
              )}
            </div>
            {formData.travelDate && formData.travelTime && (
              <div className="vb-date-summary">
                <span>📅</span>
                <span>
                  Pickup on <strong>{fmt(formData.travelDate)}</strong> at{" "}
                  <strong>{formData.travelTime}</strong>
                  {formData.tripType === "Round Trip" && formData.returnDate && (
                    <> → Return on <strong>{fmt(formData.returnDate)}</strong></>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="vb-section">
            <h3><span className="sec-icon">👤</span> Customer Details</h3>
            <div className="vb-grid-2">
              <div className="vb-field">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" name="name" placeholder="Your full name"
                  value={formData.name} onChange={handleChange} required />
              </div>
              <div className="vb-field">
                <label>Phone Number <span className="req">*</span></label>
                <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX"
                  value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="vb-field">
                <label>Email <span style={{fontSize:"0.75rem",color:"#888"}}>(for confirmation)</span></label>
                <input type="email" name="email" placeholder="you@email.com"
                  value={formData.email} onChange={handleChange} />
              </div>
              <div className="vb-field">
                <label>No. of Persons <span className="req">*</span></label>
                <input type="number" name="noOfPersons" placeholder="e.g. 3"
                  value={formData.noOfPersons} onChange={handleChange} min="1" required />
              </div>
              <div className="vb-field">
                <label>Pickup Location <span className="req">*</span></label>
                <input type="text" name="pickupLocation" placeholder="Where to pick you up"
                  value={formData.pickupLocation} onChange={handleChange} required />
              </div>
              <div className="vb-field">
                <label>Drop Location</label>
                <input type="text" name="dropLocation" placeholder="Drop location"
                  value={formData.dropLocation} onChange={handleChange} />
              </div>
            </div>
            <div className="vb-field">
              <label>Address</label>
              <textarea name="address" placeholder="Your full address"
                value={formData.address} onChange={handleChange} rows={2} />
            </div>
            <div className="vb-field">
              <label>Special Requests</label>
              <textarea name="specialRequest" placeholder="Any special requirements?"
                value={formData.specialRequest} onChange={handleChange} rows={2} />
            </div>
          </div>

          {error && <div className="vb-error">⚠ {error}</div>}

          <div className="vb-actions">
            <button type="button" className="vb-cancel"
              onClick={() => navigate("/ourvehicles")}>Cancel</button>
            <button type="submit" className="vb-submit" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Booking ✓"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default VehiclesBooking;