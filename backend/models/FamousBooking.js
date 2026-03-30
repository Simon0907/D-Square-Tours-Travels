const mongoose = require("mongoose");

const famousBookingSchema = new mongoose.Schema(
  {
    bookingId:       { type: String, unique: true },
    customer:        { type: String, required: true, trim: true },
    phone:           { type: String, required: true },
    address:         { type: String },
    pickupLocation:  { type: String, required: true },
    numberOfPersons: { type: Number, required: true },
    packageTitle:    { type: String, default: "5 Days Round Trip" },
    route: {
      type: String,
      default: "Madurai → Rameswaram → Kanyakumari → Thiruvananthapuram",
    },
    travelDate:   { type: Date, required: true },
    travelTime:   { type: String, required: true },
    returnDate:   { type: Date, required: true },
    vehicle:      { type: String, required: true },
    vehicleRent:  { type: Number },
    kmRate:       { type: Number },
    totalKm:      { type: Number, default: 1100 },
    days:         { type: Number, default: 5 },
    extraCharges: { type: Number, default: 2500 },
    amount:       { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    type: { type: String, default: "Famous Package" },
  },
  { timestamps: true }
);

famousBookingSchema.pre("save", async function (next) {
  if (!this.bookingId) this.bookingId = `FAM-${Date.now()}`;
  next();
});

module.exports = mongoose.model("FamousBooking", famousBookingSchema);