const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }, // helps with some Gmail configs
});

// ── Verify connection on startup ────────────────────────────────────────────
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email config error:", err.message);
    console.error("   Check EMAIL_USER and EMAIL_PASS in .env");
  } else {
    console.log("✅ Email server ready");
  }
});

// ── HTML wrapper ────────────────────────────────────────────────────────────
const wrap = (body) => `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#ff6b00,#e05a00);padding:22px 28px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:800;">D Square Tours & Travels</h1>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">Madurai | +91 86808 68173</p>
    </div>
    <div style="padding:28px 28px 20px;">
      ${body}
    </div>
    <div style="background:#f9f9f9;padding:14px 28px;border-top:1px solid #eee;text-align:center;">
      <p style="color:#aaa;font-size:12px;margin:0;">📞 +91 86808 68173 &nbsp;|&nbsp; ✉️ dsquaretourtravles@gmail.com</p>
    </div>
  </div>
`;

const row = (label, value) =>
  `<tr><td style="padding:6px 0;color:#888;font-size:14px;width:140px;">${label}</td><td style="padding:6px 0;color:#1a1a1a;font-size:14px;font-weight:600;">${value || "—"}</td></tr>`;

const table = (rows) =>
  `<table style="width:100%;border-collapse:collapse;background:#fff8f2;border:1px solid rgba(255,107,0,0.15);border-radius:8px;padding:12px;margin:16px 0;">${rows}</table>`;

// ══════════════════════════════════════════════════════════════════════════════
// SEND BOOKING CONFIRMATION TO CUSTOMER
// ══════════════════════════════════════════════════════════════════════════════
const sendBookingConfirmation = async ({ to, name, type, details, bookingId }) => {
  if (!to || !to.includes("@")) return;
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to,
      subject: `✅ Booking Received — D Square Tours & Travels`,
      html: wrap(`
        <p style="font-size:16px;color:#333;">Dear <strong>${name}</strong>,</p>
        <p style="color:#555;margin-bottom:16px;">Thank you for choosing <strong>D Square Tours & Travels</strong>! Your <strong>${type}</strong> has been received successfully.</p>
        ${table(details)}
        ${bookingId ? `<p style="color:#888;font-size:13px;">Reference ID: <strong>${bookingId}</strong></p>` : ""}
        <p style="color:#555;margin-top:16px;">Our team will review your booking and contact you shortly to confirm.</p>
        <p style="color:#888;font-size:13px;margin-top:8px;">If you have any questions, call us at <strong>+91 86808 68173</strong></p>
      `),
    });
    console.log(`✅ Confirmation email sent to ${to}`);
  } catch (err) {
    console.error("❌ Customer email failed:", err.message);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// SEND CONFIRMATION EMAIL WHEN ADMIN CONFIRMS A BOOKING
// ══════════════════════════════════════════════════════════════════════════════
const sendAdminConfirmedEmail = async ({ to, name, type, details, bookingId }) => {
  if (!to || !to.includes("@")) return;
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to,
      subject: `🎉 Booking Confirmed — D Square Tours & Travels`,
      html: wrap(`
        <p style="font-size:16px;color:#333;">Dear <strong>${name}</strong>,</p>
        <div style="background:#f0fff4;border:1px solid #c3e6cb;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
          <p style="color:#1e8a4a;font-weight:700;margin:0;font-size:15px;">✅ Your booking has been CONFIRMED!</p>
        </div>
        <p style="color:#555;margin-bottom:16px;">We're excited to serve you. Here are your booking details:</p>
        ${table(details)}
        ${bookingId ? `<p style="color:#888;font-size:13px;">Booking ID: <strong>${bookingId}</strong></p>` : ""}
        <p style="color:#555;margin-top:16px;">Please be ready at your pickup location on time. Our driver will contact you before arrival.</p>
        <p style="color:#888;font-size:13px;margin-top:8px;">For any queries: <strong>+91 86808 68173</strong></p>
      `),
    });
    console.log(`✅ Confirmed email sent to ${to}`);
  } catch (err) {
    console.error("❌ Confirmed email failed:", err.message);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFY ADMIN OF NEW BOOKING/ENQUIRY
// ══════════════════════════════════════════════════════════════════════════════
const sendAdminNotification = async ({ type, customerName, details }) => {
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_USER, // dsquaretourtravles@gmail.com
      subject: `🔔 New ${type} — ${customerName}`,
      html: wrap(`
        <h2 style="color:#ff6b00;margin-bottom:16px;">New ${type} Received</h2>
        <p style="color:#555;margin-bottom:12px;">A new ${type.toLowerCase()} has been submitted. Login to admin dashboard to confirm or cancel.</p>
        ${table(details)}
        <div style="margin-top:20px;text-align:center;">
          <a href="http://localhost:5173/admin" style="background:#ff6b00;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Open Admin Dashboard</a>
        </div>
      `),
    });
    console.log(`✅ Admin notified: ${type} from ${customerName}`);
  } catch (err) {
    console.error("❌ Admin notification failed:", err.message);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFY ADMIN OF NEW CUSTOMER REGISTRATION
// ══════════════════════════════════════════════════════════════════════════════
const sendNewCustomerAlert = async ({ name, email }) => {
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_USER,
      subject: `👤 New Customer Registered — ${name}`,
      html: wrap(`
        <h2 style="color:#ff6b00;margin-bottom:16px;">New Customer Registered</h2>
        ${table(`
          ${row("Name",  name)}
          ${row("Email", email)}
          ${row("Time",  new Date().toLocaleString("en-IN"))}
        `)}
        <p style="color:#888;font-size:13px;margin-top:12px;">Login to admin dashboard to view customer details.</p>
      `),
    });
    console.log(`✅ Admin notified: new customer ${name}`);
  } catch (err) {
    console.error("❌ New customer alert failed:", err.message);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendAdminConfirmedEmail,
  sendAdminNotification,
  sendNewCustomerAlert,
  row,   // export helper so routes can use it
};