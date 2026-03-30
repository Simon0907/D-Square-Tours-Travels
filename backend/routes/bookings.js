const express     = require("express");
const router      = express.Router();
const TourBooking = require("../models/TourBooking");
const { protect } = require("../middleware/auth");
const { sendBookingConfirmation, sendAdminNotification } = require("../config/email");

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/bookings/packages — NO LOGIN REQUIRED
// ══════════════════════════════════════════════════════════════════════════════
router.post("/packages", async (req, res) => {
  try {
    const {
      customer, email, phone, address, pickupLocation,
      numberOfPersons, packageTitle, travelDate, returnDate,
      numberOfDays, vehicle, acType, specialRequests,
      packagePrice, amount,
    } = req.body;

    if (!customer || !phone || !pickupLocation || !packageTitle || !travelDate || !vehicle) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const booking = await TourBooking.create({
      customer, email: email || "", phone, address, pickupLocation,
      numberOfPersons, packageTitle, travelDate, returnDate,
      numberOfDays, vehicle, acType, specialRequests,
      packagePrice, amount,
    });

    // ── Email to admin ────────────────────────────────────────────────────────
    await sendAdminNotification({
      type: "📅 Tour Package Booking",
      customerName: customer,
      details: `
        <p><strong>Customer:</strong> ${customer}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Package:</strong> ${packageTitle}</p>
        <p><strong>Travel Date:</strong> ${new Date(travelDate).toLocaleDateString("en-IN")}</p>
        <p><strong>Return Date:</strong> ${returnDate ? new Date(returnDate).toLocaleDateString("en-IN") : "—"}</p>
        <p><strong>Days:</strong> ${numberOfDays || "—"}</p>
        <p><strong>Vehicle:</strong> ${vehicle} (${acType || "AC"})</p>
        <p><strong>Persons:</strong> ${numberOfPersons}</p>
        <p><strong>Pickup:</strong> ${pickupLocation}</p>
        <p><strong>Amount:</strong> ₹${Number(amount).toLocaleString()}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      `,
    });

    // ── Confirmation email to customer ────────────────────────────────────────
    if (email) {
      await sendBookingConfirmation({
        to: email,
        name: customer,
        type: "Tour Package Booking",
        details: `
          <p><strong>Package:</strong> ${packageTitle}</p>
          <p><strong>Travel Date:</strong> ${new Date(travelDate).toLocaleDateString("en-IN")}</p>
          <p><strong>Return Date:</strong> ${returnDate ? new Date(returnDate).toLocaleDateString("en-IN") : "—"}</p>
          <p><strong>Vehicle:</strong> ${vehicle} (${acType || "AC"})</p>
          <p><strong>Persons:</strong> ${numberOfPersons}</p>
          <p><strong>Pickup:</strong> ${pickupLocation}</p>
          <p><strong>Total Amount:</strong> ₹${Number(amount).toLocaleString()}</p>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        `,
      });
    }

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Tour booking error:", error);
    res.status(500).json({ message: "Failed to create booking." });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/bookings/packages/me — logged-in user's own bookings
// ══════════════════════════════════════════════════════════════════════════════
router.get("/packages/me", protect, async (req, res) => {
  try {
    const bookings = await TourBooking.find({
      email: req.user.email,
    }).sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id:         b._id,
      status:      b.status,
      travelDate:  b.travelDate,
      totalAmount: b.amount,
      createdAt:   b.createdAt,
      package: {
        title:       b.packageTitle,
        destination: b.pickupLocation,
        duration:    b.numberOfDays ? `${b.numberOfDays} Days` : "",
        price:       b.amount,
        image:       null,
      },
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

module.exports = router;