const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Send booking confirmation to customer ──────────────────────────────────
const sendBookingConfirmation = async ({ to, name, type, details }) => {
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to,
      subject: `✅ Booking Confirmed — D Square Tours & Travels`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#ff6b00,#e05a00);padding:24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;">D Square Tours & Travels</h1>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;">Booking Confirmation</p>
          </div>
          <div style="padding:28px;">
            <p style="font-size:16px;color:#333;">Dear <strong>${name}</strong>,</p>
            <p style="color:#555;">Thank you for booking with us! Your <strong>${type}</strong> has been received.</p>
            <div style="background:#fff8f2;border:1px solid rgba(255,107,0,0.2);border-radius:8px;padding:16px;margin:20px 0;">
              ${details}
            </div>
            <p style="color:#555;">Our team will contact you shortly to confirm your booking.</p>
            <p style="color:#888;font-size:13px;margin-top:24px;">
              📞 +91 86808 68173 &nbsp;|&nbsp; ✉️ dsquaretourtravles@gmail.com
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
    // Don't throw — email failure shouldn't break booking
  }
};

// ── Notify admin of new booking ────────────────────────────────────────────
const sendAdminNotification = async ({ type, customerName, details }) => {
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_USER,
      subject: `🔔 New ${type} — ${customerName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#ff6b00;">New ${type} Received</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <div style="background:#f9f9f9;border:1px solid #eee;border-radius:8px;padding:16px;margin:16px 0;">
            ${details}
          </div>
          <p style="color:#888;font-size:13px;">Login to admin dashboard to manage this booking.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Admin email error:", err.message);
  }
};

module.exports = { sendBookingConfirmation, sendAdminNotification };