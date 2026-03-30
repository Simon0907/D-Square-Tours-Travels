const express          = require("express");
const router           = express.Router();
const FamousBooking    = require("../models/FamousBooking");
const PackageEnquiry   = require("../models/PackageEnquiry");
const VehicleBooking   = require("../models/VehicleBooking");
const { protect }      = require("../middleware/auth");
const { sendBookingConfirmation, sendAdminNotification, row } = require("../config/email");

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
    sendAdminNotification({
      type: "⭐ Famous Package Booking",
      customerName: customer,
      details:
        row("Customer",    customer) +
        row("Phone",       phone) +
        row("Pickup",      pickupLocation) +
        row("Persons",     numberOfPersons) +
        row("Vehicle",     vehicle) +
        row("Travel Date", new Date(travelDate).toLocaleDateString("en-IN")) +
        row("Pickup Time", travelTime) +
        row("Return Date", new Date(returnDate).toLocaleDateString("en-IN")) +
        row("Total KM",    `${totalKm || 1100} km`) +
        row("Amount",      `₹${Number(amount).toLocaleString()}`) +
        row("Booking ID",  booking.bookingId),
    }).catch(() => {});

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
    sendAdminNotification({
      type: "📋 Package Enquiry",
      customerName: name,
      details:
        row("Customer",    name) +
        row("Phone",       phoneNumber) +
        (email ? row("Email", email) : "") +
        row("Package",     selectedPackage) +
        row("Pickup",      pickupLocation) +
        row("Persons",     noOfPersons) +
        row("Travel Date", travelDate) +
        row("Time",        travelTime || "—") +
        row("Return Date", returnDate || "—") +
        row("Enquiry ID",  enquiry.enquiryId),
    }).catch(() => {});

    // ── Confirmation email to customer ────────────────────────────────────────
    if (email) {
      sendBookingConfirmation({
        to: email, name, type: "Package Enquiry",
        details:
          row("Package",     selectedPackage) +
          row("Travel Date", travelDate) +
          row("Time",        travelTime || "—") +
          row("Return Date", returnDate || "—") +
          row("Pickup",      pickupLocation) +
          row("Persons",     noOfPersons) +
          row("Reference",   enquiry.enquiryId),
        bookingId: enquiry.enquiryId,
      }).catch(() => {});
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
    sendAdminNotification({
      type: "🚗 Vehicle Booking",
      customerName: name,
      details:
        row("Customer",    name) +
        row("Phone",       phone) +
        (email ? row("Email", email) : "") +
        row("Vehicle",     vehicle?.name || vehicle) +
        row("Trip Type",   tripType || "One Way") +
        row("Travel Date", travelDate) +
        row("Pickup Time", travelTime) +
        (returnDate ? row("Return Date", returnDate) : "") +
        row("Pickup",      pickupLocation) +
        (dropLocation ? row("Drop", dropLocation) : "") +
        row("Persons",     noOfPersons) +
        row("Rent/Day",    vehicle?.rentPerDay || "—") +
        row("Booking ID",  booking.bookingId),
    }).catch(() => {});

    // ── Confirmation email to customer ────────────────────────────────────────
    if (email) {
      sendBookingConfirmation({
        to: email, name, type: "Vehicle Booking",
        details:
          row("Vehicle",     vehicle?.name || vehicle) +
          row("Trip Type",   tripType || "One Way") +
          row("Travel Date", travelDate) +
          row("Pickup Time", travelTime) +
          (returnDate ? row("Return Date", returnDate) : "") +
          row("Pickup",      pickupLocation) +
          row("Booking ID",  booking.bookingId),
        bookingId: booking.bookingId,
      }).catch(() => {});
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