const express         = require("express");
const router          = express.Router();
const User            = require("../models/User");
const TourBooking     = require("../models/TourBooking");
const FamousBooking   = require("../models/FamousBooking");
const PackageEnquiry  = require("../models/PackageEnquiry");
const VehicleBooking  = require("../models/VehicleBooking");
const Contact         = require("../models/Contact");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── GET /api/admin/stats ────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const [
      totalTourBookings, totalFamousBookings,
      totalEnquiries, totalVehicleBookings,
      totalCustomers, totalMessages,
      confirmedBookings,
    ] = await Promise.all([
      TourBooking.countDocuments(),
      FamousBooking.countDocuments(),
      PackageEnquiry.countDocuments(),
      VehicleBooking.countDocuments(),
      User.countDocuments({ role: "user" }),
      Contact.countDocuments({ isRead: false }),
      TourBooking.find({ status: "confirmed" }),
    ]);

    const totalRevenue = confirmedBookings.reduce((s, b) => s + (b.amount || 0), 0);
    const pendingBookings =
      (await TourBooking.countDocuments({ status: "pending" })) +
      (await FamousBooking.countDocuments({ status: "pending" })) +
      (await VehicleBooking.countDocuments({ status: "pending" }));

    res.json({
      totalTourBookings,
      totalFamousBookings,
      totalEnquiries,
      totalVehicleBookings,
      totalBookings: totalTourBookings + totalFamousBookings + totalVehicleBookings,
      totalCustomers,
      totalMessages,
      totalRevenue: `₹${totalRevenue.toLocaleString()}`,
      pendingBookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

// ── GET /api/admin/bookings ─────────────────────────────────────────────────
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await TourBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

// ── GET /api/admin/famous-bookings ──────────────────────────────────────────
router.get("/famous-bookings", async (req, res) => {
  try {
    const bookings = await FamousBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch famous bookings." });
  }
});

// ── GET /api/admin/package-enquiries ────────────────────────────────────────
router.get("/package-enquiries", async (req, res) => {
  try {
    const enquiries = await PackageEnquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries." });
  }
});

// ── GET /api/admin/vehicle-bookings ─────────────────────────────────────────
router.get("/vehicle-bookings", async (req, res) => {
  try {
    const bookings = await VehicleBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicle bookings." });
  }
});

// ── GET /api/admin/customers ─────────────────────────────────────────────────
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers." });
  }
});

// ── GET /api/admin/messages ──────────────────────────────────────────────────
router.get("/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages." });
  }
});

// ── PATCH /api/admin/bookings/:id/status ────────────────────────────────────
// Update status for any booking type
router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { id }     = req.params;
    const { status, type } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    let booking;
    // Try all booking models
    booking = await TourBooking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) booking = await FamousBooking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) booking = await VehicleBooking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) booking = await PackageEnquiry.findByIdAndUpdate(id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    res.json({ message: `Status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status." });
  }
});

// ── DELETE /api/admin/bookings/:id ──────────────────────────────────────────
router.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let deleted;
    deleted = await TourBooking.findByIdAndDelete(id);
    if (!deleted) deleted = await FamousBooking.findByIdAndDelete(id);
    if (!deleted) deleted = await VehicleBooking.findByIdAndDelete(id);
    if (!deleted) deleted = await PackageEnquiry.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Booking not found." });
    res.json({ message: "Booking deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking." });
  }
});

// ── DELETE /api/admin/customers/:id ─────────────────────────────────────────
router.delete("/customers/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Customer not found." });
    res.json({ message: "Customer deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete customer." });
  }
});

// ── PATCH /api/admin/messages/:id/read ──────────────────────────────────────
router.patch("/messages/:id/read", async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read." });
  }
});

module.exports = router;