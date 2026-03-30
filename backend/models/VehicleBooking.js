const mongoose = require("mongoose");

const vehicleBookingSchema = new mongoose.Schema(
  {
    bookingId:       { type: String, unique: true },
    customer:        { type: String, required: true, trim: true },
    phone:           { type: String, required: true },
    email:           { type: String, lowercase: true },
    address:         { type: String },
    pickupLocation:  { type: String, required: true },
    dropLocation:    { type: String },
    numberOfPersons: { type: Number, required: true },
    vehicleName:     { type: String, required: true },
    rentPerDay:      { type: String },
    fuelCharge:      { type: String },
    driverBetta:     { type: String },
    travelDate:      { type: Date, required: true },
    travelTime:      { type: String, required: true },
    returnDate:      { type: Date },
    tripType: {
      type: String,
      enum: ["One Way", "Round Trip", "Local"],
      default: "One Way",
    },
    specialRequest: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    type: { type: String, default: "Vehicle Booking" },
  },
  { timestamps: true }
);

vehicleBookingSchema.pre("save", async function (next) {
  if (!this.bookingId) this.bookingId = `VEH-${Date.now()}`;
  next();
});

module.exports = mongoose.model("VehicleBooking", vehicleBookingSchema);