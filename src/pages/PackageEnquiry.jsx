import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/PackageEnquiry.css";

const BASE  = "http://localhost:5000/api";
const today = new Date().toISOString().split("T")[0];

const PackageEnquiry = () => {
  const location    = useLocation();
  const navigate    = useNavigate();
  const packageData = location.state?.packageData;

  const [formData, setFormData] = useState({
    name: "", address: "", phoneNumber: "", email: "",
    pickupLocation: "", noOfPersons: "",
    selectedPackage: packageData?.title || "",
    travelDate: "", travelTime: "", returnDate: "",
  });

  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const minReturn = formData.travelDate
    ? new Date(new Date(formData.travelDate).getTime() + 86400000).toISOString().split("T")[0]
    : today;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    if (!formData.travelDate || !formData.travelTime || !formData.returnDate) {
      setError("Please fill in travel date, pickup time and return date.");
      return;
    }
    if (new Date(formData.returnDate) <= new Date(formData.travelDate)) {
      setError("Return date must be after travel date.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/enquiries`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Submission failed. Please try again.");
        return;
      }

      alert(
        `✅ Enquiry Submitted!\n\nPackage: ${formData.selectedPackage}\nTravel: ${formData.travelDate} at ${formData.travelTime}\nReturn: ${formData.returnDate}\n\nWe will contact you soon, ${formData.name}!\nReference: ${data.enquiry?.enquiryId || ""}${formData.email ? "\n\nConfirmation sent to your email." : ""}`
      );

      redirectAfterBooking();
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="peq-page">
      <div className="peq-container">

        <div className="peq-header">
          <span className="peq-badge">Package Enquiry</span>
          <h1>{packageData?.title || "Tour Package"}</h1>
          <p className="peq-sub">
            Fill in your details and we'll get back to you with pricing and availability.
          </p>
        </div>

        <form className="peq-form" onSubmit={handleSubmit}>

          {/* Customer Details */}
          <div className="peq-section">
            <h3><span className="sec-icon">👤</span> Customer Details</h3>
            <div className="peq-grid-2">
              <div className="peq-field">
                <label>Full Name <span className="req">*</span></label>
                <input type="text" name="name" placeholder="Your full name"
                  value={formData.name} onChange={handleChange} required />
              </div>
              <div className="peq-field">
                <label>Phone Number <span className="req">*</span></label>
                <input type="tel" name="phoneNumber" placeholder="+91 XXXXX XXXXX"
                  value={formData.phoneNumber} onChange={handleChange} required />
              </div>
              <div className="peq-field">
                <label>Email <span style={{fontSize:"0.75rem",color:"#888"}}>(for confirmation)</span></label>
                <input type="email" name="email" placeholder="you@email.com"
                  value={formData.email} onChange={handleChange} />
              </div>
              <div className="peq-field">
                <label>No. of Persons <span className="req">*</span></label>
                <input type="number" name="noOfPersons" placeholder="e.g. 4"
                  value={formData.noOfPersons} onChange={handleChange} min="1" required />
              </div>
              <div className="peq-field">
                <label>Pickup Location <span className="req">*</span></label>
                <input type="text" name="pickupLocation" placeholder="Where to pick you up"
                  value={formData.pickupLocation} onChange={handleChange} required />
              </div>
              <div className="peq-field">
                <label>Selected Package</label>
                <input type="text" name="selectedPackage"
                  value={formData.selectedPackage} readOnly className="readonly-input" />
              </div>
            </div>
            <div className="peq-field">
              <label>Address</label>
              <textarea name="address" placeholder="Your full address"
                value={formData.address} onChange={handleChange} rows={2} />
            </div>
          </div>

          {/* Travel Date & Time */}
          <div className="peq-section">
            <h3><span className="sec-icon">🗓</span> Travel Date & Time</h3>
            <div className="peq-grid-3">
              <div className="peq-field">
                <label>Travel Start Date <span className="req">*</span></label>
                <input type="date" name="travelDate" value={formData.travelDate}
                  onChange={handleChange} min={today} required className="date-input" />
              </div>
              <div className="peq-field">
                <label>Pickup Time <span className="req">*</span></label>
                <input type="time" name="travelTime" value={formData.travelTime}
                  onChange={handleChange} required className="date-input" />
              </div>
              <div className="peq-field">
                <label>Return Date <span className="req">*</span></label>
                <input type="date" name="returnDate" value={formData.returnDate}
                  onChange={handleChange} min={minReturn} required className="date-input" />
              </div>
            </div>
            {formData.travelDate && formData.travelTime && formData.returnDate && (
              <div className="peq-date-summary">
                <span>📅</span>
                <span>
                  Pickup on <strong>{fmt(formData.travelDate)}</strong> at{" "}
                  <strong>{formData.travelTime}</strong> → Return on{" "}
                  <strong>{fmt(formData.returnDate)}</strong>
                </span>
              </div>
            )}
          </div>

          {error && <div className="peq-error">⚠ {error}</div>}

          <div className="peq-actions">
            <button type="button" className="peq-cancel"
              onClick={() => navigate("/packages")}>Cancel</button>
            <button type="submit" className="peq-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Enquire Now →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PackageEnquiry;