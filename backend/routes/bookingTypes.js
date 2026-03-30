const express          = require("express");
const router           = express.Router();
const FamousBooking    = require("../models/FamousBooking");
const PackageEnquiry   = require("../models/PackageEnquiry");
const VehicleBooking   = require("../models/VehicleBooking");
const { protect }      = require("../middleware/auth");
const { sendBookingConfirmation, sendAdminNotification } = require("../config/email");

// ══════════════════════════════════════════════════════════════════════════════
// FAMOUS PACKAGE BOOKINGS — NO LOGIN REQUIRED
// POST /api/famous-bookings
// ══════════════════════════════════════════════════════════════════════════════
router.post("/famous-bookings", async (req, res) => {
  try {
    const {
      customer, phone, address, pickupLocation, numberOfPersons,
      travelDate, travelTime, returnDate, vehicle,
      vehicleRent, kmRate, totalKm, days, extraCharges, amount,
    } = req.body;

    if (!customer || !phone || !pickupLocation || !travelDate || !vehicle) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const booking = await FamousBooking.create({
      customer, phone, address, pickupLocation, numberOfPersons,
      travelDate, travelTime, returnDate, vehicle,
      vehicleRent, kmRate, totalKm, days, extraCharges, amount,
    });

    // ── Email to admin ────────────────────────────────────────────────────────
    await sendAdminNotification({
      type: "⭐ Famous Package Booking",
      customerName: customer,
      details: `
        <p><strong>Customer:</strong> ${customer}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Pickup:</strong> ${pickupLocation}</p>
        <p><strong>Persons:</strong> ${numberOfPersons}</p>
        <p><strong>Vehicle:</strong> ${vehicle}</p>
        <p><strong>Travel Date:</strong> ${travelDate} at ${travelTime}</p>
        <p><strong>Return Date:</strong> ${returnDate}</p>
        <p><strong>Total KM:</strong> ${totalKm || 1100} km</p>
        <p><strong>Amount:</strong> ₹${Number(amount).toLocaleString()}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      `,
    });

    res.status(201).json({ message: "Famous package booked successfully", booking });
  } catch (error) {
    console.error("Famous booking error:", error);
    res.status(500).json({ message: "Failed to create booking." });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// PACKAGE ENQUIRIES — NO LOGIN REQUIRED
// POST /api/enquiries
// ══════════════════════════════════════════════════════════════════════════════
router.post("/enquiries", async (req, res) => {
  try {
    const {
      name, phoneNumber, email, address, pickupLocation,
      noOfPersons, selectedPackage, travelDate, travelTime, returnDate,
    } = req.body;

    if (!name || !phoneNumber || !pickupLocation || !selectedPackage || !travelDate) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const enquiry = await PackageEnquiry.create({
      customer:        name,
      phone:           phoneNumber,
      email:           email || "",
      address,
      pickupLocation,
      numberOfPersons: noOfPersons,
      packageTitle:    selectedPackage,
      travelDate,
      travelTime,
      returnDate,
    });

    // ── Email to admin ────────────────────────────────────────────────────────
    await sendAdminNotification({
      type: "📋 Package Enquiry",
      customerName: name,
      details: `
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Package:</strong> ${selectedPackage}</p>
        <p><strong>Pickup:</strong> ${pickupLocation}</p>
        <p><strong>Persons:</strong> ${noOfPersons}</p>
        <p><strong>Travel Date:</strong> ${travelDate} at ${travelTime || "—"}</p>
        <p><strong>Return Date:</strong> ${returnDate || "—"}</p>
        <p><strong>Enquiry ID:</strong> ${enquiry.enquiryId}</p>
      `,
    });

    // ── Confirmation email to customer (if they gave email) ───────────────────
    if (email) {
      await sendBookingConfirmation({
        to: email,
        name,
        type: "Package Enquiry",
        details: `
          <p><strong>Package:</strong> ${selectedPackage}</p>
          <p><strong>Travel Date:</strong> ${travelDate} at ${travelTime || "—"}</p>
          <p><strong>Return Date:</strong> ${returnDate || "—"}</p>
          <p><strong>Pickup:</strong> ${pickupLocation}</p>
          <p><strong>Persons:</strong> ${noOfPersons}</p>
          <p><strong>Reference ID:</strong> ${enquiry.enquiryId}</p>
          <p style="color:#888;margin-top:12px;">Our team will contact you shortly with pricing details.</p>
        `,
      });
    }

    res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
  } catch (error) {
    console.error("Enquiry error:", error);
    res.status(500).json({ message: "Failed to submit enquiry." });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// VEHICLE BOOKINGS — NO LOGIN REQUIRED
// POST /api/vehicle-bookings
// ══════════════════════════════════════════════════════════════════════════════
router.post("/vehicle-bookings", async (req, res) => {
  try {
    const {
      name, phone, email, address, pickupLocation, dropLocation,
      noOfPersons, travelDate, travelTime, returnDate,
      tripType, specialRequest, vehicle,
    } = req.body;

    if (!name || !phone || !pickupLocation || !travelDate || !vehicle) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const booking = await VehicleBooking.create({
      customer:        name,
      phone,
      email:           email || "",
      address,
      pickupLocation,
      dropLocation,
      numberOfPersons: noOfPersons,
      vehicleName:     vehicle?.name || vehicle,
      rentPerDay:      vehicle?.rentPerDay,
      fuelCharge:      vehicle?.fuelChargeBelowKm,
      driverBetta:     vehicle?.driverBetta,
      travelDate,
      travelTime,
      returnDate:      returnDate || null,
      tripType:        tripType || "One Way",
      specialRequest,
    });

    // ── Email to admin ────────────────────────────────────────────────────────
    await sendAdminNotification({
      type: "🚗 Vehicle Booking",
      customerName: name,
      details: `
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Vehicle:</strong> ${vehicle?.name || vehicle}</p>
        <p><strong>Trip Type:</strong> ${tripType || "One Way"}</p>
        <p><strong>Travel Date:</strong> ${travelDate} at ${travelTime}</p>
        ${returnDate ? `<p><strong>Return Date:</strong> ${returnDate}</p>` : ""}
        <p><strong>Pickup:</strong> ${pickupLocation}</p>
        ${dropLocation ? `<p><strong>Drop:</strong> ${dropLocation}</p>` : ""}
        <p><strong>Persons:</strong> ${noOfPersons}</p>
        <p><strong>Rent/Day:</strong> ${vehicle?.rentPerDay || "—"}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      `,
    });

    // ── Confirmation email to customer (if email given) ───────────────────────
    if (email) {
      await sendBookingConfirmation({
        to: email,
        name,
        type: "Vehicle Booking",
        details: `
          <p><strong>Vehicle:</strong> ${vehicle?.name || vehicle}</p>
          <p><strong>Trip Type:</strong> ${tripType || "One Way"}</p>
          <p><strong>Travel Date:</strong> ${travelDate} at ${travelTime}</p>
          ${returnDate ? `<p><strong>Return Date:</strong> ${returnDate}</p>` : ""}
          <p><strong>Pickup:</strong> ${pickupLocation}</p>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p style="color:#888;margin-top:12px;">Our team will contact you shortly to confirm your booking.</p>
        `,
      });
    }

    res.status(201).json({ message: "Vehicle booked successfully", booking });
  } catch (error) {
    console.error("Vehicle booking error:", error);
    res.status(500).json({ message: "Failed to create vehicle booking." });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/vehicle-bookings/me — logged-in user's own bookings
// ══════════════════════════════════════════════════════════════════════════════
router.get("/vehicle-bookings/me", protect, async (req, res) => {
  try {
    const bookings = await VehicleBooking.find({
      email: req.user.email,
    }).sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id:         b._id,
      status:      b.status,
      startDate:   b.travelDate,
      endDate:     b.returnDate,
      totalAmount: 0,
      createdAt:   b.createdAt,
      vehicle: {
        name:        b.vehicleName,
        type:        b.tripType,
        seats:       b.numberOfPersons,
        pricePerDay: b.rentPerDay,
        image:       null,
      },
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicle bookings." });
  }
});

module.exports = router;