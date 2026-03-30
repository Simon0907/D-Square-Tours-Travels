const mongoose = require("mongoose");

const tourBookingSchema = new mongoose.Schema(
  {
    bookingId:       { type: String, unique: true },
    customer:        { type: String, required: true, trim: true },
    email:           { type: String, required: true, lowercase: true },
    phone:           { type: String, required: true },
    address:         { type: String },
    pickupLocation:  { type: String, required: true },
    numberOfPersons: { type: Number, required: true },
    packageTitle:    { type: String, required: true },
    travelDate:      { type: Date, required: true },
    returnDate:      { type: Date, required: true },
    numberOfDays:    { type: Number },
    vehicle:         { type: String, required: true },
    acType:          { type: String, enum: ["AC", "Non-AC"], default: "AC" },
    specialRequests: { type: String },
    packagePrice:    { type: String },
    amount:          { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    type: { type: String, default: "Package" },
  },
  { timestamps: true }
);

// Auto-generate bookingId
tourBookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    this.bookingId = `BK-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("TourBooking", tourBookingSchema);