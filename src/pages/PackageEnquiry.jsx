import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/PackageEnquiry.css";

const today = new Date().toISOString().split("T")[0];

const PackageEnquiry = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const packageData = location.state?.packageData;

  const [formData, setFormData] = useState({
    name:            "",
    address:         "",
    phoneNumber:     "",
    pickupLocation:  "",
    noOfPersons:     "",
    selectedPackage: packageData?.title || "",
    travelDate:      "",   // ← NEW
    travelTime:      "",   // ← NEW
    returnDate:      "",   // ← NEW
  });

  const [error, setError] = useState("");

  const minReturn = formData.travelDate
    ? new Date(new Date(formData.travelDate).getTime() + 86400000)
        .toISOString().split("T")[0]
    : today;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })
      : "";

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

    // ── Build enquiry object ──────────────────────────────────────────────────
    const enquiry = {
      id:              `ENQ-${Date.now()}`,
      type:            "Package Enquiry",
      packageTitle:    formData.selectedPackage,
      customer:        formData.name,
      phone:           formData.phoneNumber,
      address:         formData.address,
      pickupLocation:  formData.pickupLocation,
      numberOfPersons: formData.noOfPersons,
      travelDate:      formData.travelDate,
      travelTime:      formData.travelTime,
      returnDate:      formData.returnDate,
      status:          "pending",
      bookedAt:        new Date().toISOString(),
      date:            new Date().toLocaleDateString("en-IN", {
                         day: "numeric", month: "short", year: "numeric",
                       }),
    };

    // ── Save to localStorage for admin ────────────────────────────────────────
    const existing = JSON.parse(localStorage.getItem("adminPackageEnquiries")) || [];
    existing.unshift(enquiry);
    localStorage.setItem("adminPackageEnquiries", JSON.stringify(existing));
    window.dispatchEvent(new Event("storage"));

    // ── Also try real API (no-op if backend not ready) ────────────────────────
    try {
      await fetch("http://localhost:5000/api/enquiries", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
    } catch (_) {
      // backend not ready — localStorage already saved
    }

    alert(
      `✅ Enquiry Submitted!\n\nPackage: ${formData.selectedPackage}\nTravel: ${formData.travelDate} at ${formData.travelTime}\nReturn: ${formData.returnDate}\n\nWe will contact you soon, ${formData.name}!`
    );

    navigate("/packages");
  };

  return (
    <div className="peq-page">
      <div className="peq-container">

        {/* ── Header ── */}
        <div className="peq-header">
          <span className="peq-badge">Package Enquiry</span>
          <h1>{packageData?.title || "Tour Package"}</h1>
          <p className="peq-sub">
            Fill in your details and we'll get back to you with pricing and availability.
          </p>
        </div>

        <form className="peq-form" onSubmit={handleSubmit}>

          {/* ── Customer Details ── */}
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
                <label>Pickup Location <span className="req">*</span></label>
                <input type="text" name="pickupLocation" placeholder="Where to pick you up"
                  value={formData.pickupLocation} onChange={handleChange} required />
              </div>
              <div className="peq-field">
                <label>No. of Persons <span className="req">*</span></label>
                <input type="number" name="noOfPersons" placeholder="e.g. 4"
                  value={formData.noOfPersons} onChange={handleChange} min="1" required />
              </div>
            </div>

            <div className="peq-field">
              <label>Address</label>
              <textarea name="address" placeholder="Your full address"
                value={formData.address} onChange={handleChange} rows={2} />
            </div>

            <div className="peq-field">
              <label>Selected Package</label>
              <input type="text" name="selectedPackage"
                value={formData.selectedPackage} readOnly className="readonly-input" />
            </div>
          </div>

          {/* ── Travel Date & Time ── */}
          <div className="peq-section">
            <h3><span className="sec-icon">🗓</span> Travel Date & Time</h3>

            <div className="peq-grid-3">
              <div className="peq-field">
                <label>Travel Start Date <span className="req">*</span></label>
                <input type="date" name="travelDate"
                  value={formData.travelDate} onChange={handleChange}
                  min={today} required className="date-input" />
              </div>
              <div className="peq-field">
                <label>Pickup Time <span className="req">*</span></label>
                <input type="time" name="travelTime"
                  value={formData.travelTime} onChange={handleChange}
                  required className="date-input" />
              </div>
              <div className="peq-field">
                <label>Return Date <span className="req">*</span></label>
                <input type="date" name="returnDate"
                  value={formData.returnDate} onChange={handleChange}
                  min={minReturn} required className="date-input" />
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

          {/* ── Actions ── */}
          <div className="peq-actions">
            <button type="button" className="peq-cancel"
              onClick={() => navigate("/packages")}>Cancel</button>
            <button type="submit" className="peq-submit">Enquire Now →</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PackageEnquiry;