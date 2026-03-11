import { useLocation } from "react-router-dom";
import "../css/PackageEnquiry.css";

const PackageEnquiry = () => {

  const location = useLocation();
  const packageData = location.state?.packageData;

  return (
    <div className="enquiry-container">

      <h1 className="enquiry-title">Package Enquiry</h1>

      <div className="package-info">

        <h2>{packageData?.title}</h2>

        <p className="package-amount">
          For pricing details please enquire with us.
        </p>

      </div>

      <form className="enquiry-form">

        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" required />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" placeholder="Enter your address" required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="Enter phone number" required />
        </div>

        <div className="form-group">
          <label>Pickup Location</label>
          <input type="text" placeholder="Enter pickup location" required />
        </div>

        <div className="form-group">
          <label>No. of Persons</label>
          <input type="number" placeholder="Number of persons" required />
        </div>

        <div className="form-group">
          <label>Selected Package</label>
          <input
            type="text"
            value={packageData?.title}
            readOnly
          />
        </div>

        <button className="enquire-btn">
          Enquire Now
        </button>

      </form>

    </div>
  );
};

export default PackageEnquiry;