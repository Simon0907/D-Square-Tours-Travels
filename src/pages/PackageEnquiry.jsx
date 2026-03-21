import { useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/PackageEnquiry.css";

const PackageEnquiry = () => {
  const location = useLocation();
  const packageData = location.state?.packageData;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    pickupLocation: "",
    noOfPersons: "",
    selectedPackage: packageData?.title || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Enquiry submitted successfully!");
        setFormData({
          name: "",
          address: "",
          phoneNumber: "",
          pickupLocation: "",
          noOfPersons: "",
          selectedPackage: packageData?.title || "",
        });
      } else {
        alert(data.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="enquiry-container">
      <h1 className="enquiry-title">Package Enquiry</h1>

      <div className="package-info">
        <h2>{packageData?.title}</h2>
        <p className="package-amount">
          For pricing details please enquire with us.
        </p>
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            placeholder="Enter pickup location"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>No. of Persons</label>
          <input
            type="number"
            name="noOfPersons"
            placeholder="Number of persons"
            value={formData.noOfPersons}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Selected Package</label>
          <input
            type="text"
            name="selectedPackage"
            value={formData.selectedPackage}
            readOnly
          />
        </div>

        <button type="submit" className="enquire-btn">
          Enquire Now
        </button>
      </form>
    </div>
  );
};

export default PackageEnquiry;