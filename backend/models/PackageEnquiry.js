const mongoose = require("mongoose");

const packageEnquirySchema = new mongoose.Schema(
  {
    enquiryId:       { type: String, unique: true },
    customer:        { type: String, required: true, trim: true },
    phone:           { type: String, required: true },
    email:           { type: String, lowercase: true, default: "" },
    address:         { type: String },
    pickupLocation:  { type: String, required: true },
    numberOfPersons: { type: Number, required: true },
    packageTitle:    { type: String, required: true },
    travelDate:      { type: Date, required: true },
    travelTime:      { type: String, required: true },
    returnDate:      { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    type: { type: String, default: "Package Enquiry" },
  },
  { timestamps: true }
);

packageEnquirySchema.pre("save", async function (next) {
  if (!this.enquiryId) this.enquiryId = `ENQ-${Date.now()}`;
  next();
});

module.exports = mongoose.model("PackageEnquiry", packageEnquirySchema);