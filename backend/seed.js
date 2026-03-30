require("dotenv").config();
const mongoose = require("mongoose");
const User     = require("./models/User");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  await connectDB();

  try {
    // Remove existing admin
    await User.deleteOne({ email: process.env.ADMIN_EMAIL });

    // Create fresh admin
    const admin = await User.create({
      name:     "Admin",
      email:    process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role:     "admin",
    });

    console.log("✅ Admin created:");
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    console.log(`   Role:     ${admin.role}`);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();