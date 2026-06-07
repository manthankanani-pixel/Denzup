const express = require("express");
const dbManager = require("../models/utils/db");
const { sendEmail } = require("../models/utils/email");
const router = express.Router();

// Create booking
router.post("/create", async (req, res) => {
  try {
    const { name, phone, email, service, batch, date, paid } = req.body;

    if (!name || !phone || !email || !service || !batch || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details."
      });
    }

    // Save booking using dbManager
    const booking = await dbManager.saveBooking({
      name,
      phone,
      email,
      service,
      batch,
      date,
      paid: !!paid
    });

    console.log("📅 New booking request saved:", booking);

    // Send email notification to admin
    const adminEmailHtml = `
      <h2>New Booking Request from Danzup Studio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service/Class:</strong> ${service}</p>
      <p><strong>Batch:</strong> ${batch}</p>
      <p><strong>Preferred Date:</strong> ${date}</p>
      <p><strong>Payment Status:</strong> ${paid ? "Paid (Online Checkout)" : "Unpaid / Free Trial"}</p>
      <p><em>Booking ID: ${booking._id}</em></p>
    `;

    // Send confirmation to user
    const userEmailHtml = `
      <h2>Booking Request Received! 📅</h2>
      <p>Hi ${name},</p>
      <p>We've received your booking request for <strong>${service}</strong>.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Batch: ${batch}</li>
        <li>Date: ${date}</li>
        <li>Payment Status: ${paid ? "Paid (Success)" : "Unpaid / Trial"}</li>
        <li>Status: Pending Confirmation</li>
      </ul>
      <p>Our team will verify the availability and send you a confirmation message shortly.</p>
      <p>Best regards,<br>Danzup Studio Team</p>
    `;

    // Attempt to send emails asynchronously
    Promise.all([
      sendEmail(process.env.ADMIN_EMAIL, "🆕 New Danzup Studio Booking Request", adminEmailHtml),
      sendEmail(email, "Booking Confirmation - Danzup Studio", userEmailHtml)
    ]).catch(err => {
      console.warn("⚠️ Email sending experienced an issue:", err.message);
    });

    res.json({
      success: true,
      message: "Booking request submitted! We will contact you to confirm.",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "Booking error. Please try again." });
  }
});

module.exports = router;
