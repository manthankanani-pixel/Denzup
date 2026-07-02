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

// Create Razorpay Order
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/razorpay/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount." });
    }

    // Explicit check for missing Razorpay environment credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({ 
        success: false, 
        message: "Razorpay API keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are not configured in your server .env file." 
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await instance.orders.create(options);
    res.json({
      success: true,
      key_id: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ success: false, message: `Razorpay SDK Error: ${error.message}` });
  }
});

// Verify Razorpay Payment and Save Booking
router.post("/razorpay/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingData) {
      return res.status(400).json({ success: false, message: "Missing payment verification details." });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed." });
    }

    const { name, phone, email, service, batch, date } = bookingData;

    const booking = await dbManager.saveBooking({
      name,
      phone,
      email,
      service,
      batch,
      date,
      paid: true
    });

    console.log("📅 Verified Razorpay Booking saved:", booking);

    const adminEmailHtml = `
      <h2>New Paid Booking from Danzup Studio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service/Class:</strong> ${service}</p>
      <p><strong>Batch:</strong> ${batch}</p>
      <p><strong>Preferred Date:</strong> ${date}</p>
      <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
      <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
      <p><strong>Payment Status:</strong> Paid (Razorpay Verified)</p>
      <p><em>Booking ID: ${booking._id}</em></p>
    `;

    const userEmailHtml = `
      <h2>Booking Confirmed! 📅</h2>
      <p>Hi ${name},</p>
      <p>We've received your booking request for <strong>${service}</strong>.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Batch: ${batch}</li>
        <li>Date: ${date}</li>
        <li>Payment Status: Paid (Success via Razorpay)</li>
        <li>Status: Pending Confirmation</li>
      </ul>
      <p>Our team will verify availability and send you a confirmation message shortly.</p>
      <p>Best regards,<br>Danzup Studio Team</p>
    `;

    Promise.all([
      sendEmail(process.env.ADMIN_EMAIL, "🆕 Paid Booking Request - Danzup Studio", adminEmailHtml),
      sendEmail(email, "Booking Confirmed - Danzup Studio", userEmailHtml)
    ]).catch(err => {
      console.warn("⚠️ Email sending experienced an issue:", err.message);
    });

    res.json({
      success: true,
      message: "Payment verified and booking request submitted!",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Payment verification and booking save error:", error);
    res.status(500).json({ success: false, message: "Error completing booking." });
  }
});

module.exports = router;
