import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import '../css/VehiclesBooking.css';


const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pickupLocation: '',
    dropLocation: '',
    numberOfPersons: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking Details:', formData);
  };

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <div className="section-label">
          <span className="label-line"></span>
          <span className="label-text">BOOK YOUR RIDE</span>
        </div>
        <h1 className="form-title">Vehicle Booking Form</h1>
        <p className="form-description">
          Fill in the details below to book your vehicle. Our team will contact you shortly to confirm your booking.
        </p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Address <span className="required">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            className="form-textarea"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your complete address"
            rows="3"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pickupLocation" className="form-label">
              Pickup Location <span className="required">*</span>
            </label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              className="form-input"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Enter pickup location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dropLocation" className="form-label">
              Drop Location <span className="required">*</span>
            </label>
            <input
              type="text"
              id="dropLocation"
              name="dropLocation"
              className="form-input"
              value={formData.dropLocation}
              onChange={handleChange}
              placeholder="Enter drop location"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="numberOfPersons" className="form-label">
            Number of Persons <span className="required">*</span>
          </label>
          <input
            type="number"
            id="numberOfPersons"
            name="numberOfPersons"
            className="form-input"
            value={formData.numberOfPersons}
            onChange={handleChange}
            placeholder="Enter number of persons"
            min="1"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
