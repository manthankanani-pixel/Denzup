const express = require("express");
const dbManager = require("../models/utils/db");
const { sendEmail } = require("../models/utils/email");
const router = express.Router();

// Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields."
      });
    }

    // Save contact using dbManager (MongoDB or JSON file fallback)
    const contact = await dbManager.saveContact({
      name,
      phone,
      email,
      service: service || "Other",
      message
    });

    console.log("📝 New contact inquiry saved:", contact);

    // Send email notification to admin
    const adminEmailHtml = `
      <h2>New Inquiry from Danzup Studio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service || "Other"}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><em>Inquiry ID: ${contact._id}</em></p>
    `;

    // Send confirmation to user
    const userEmailHtml = `
      <h2>Thank You for Contacting Danzup Studio! 🎉</h2>
      <p>Hi ${name},</p>
      <p>We've received your inquiry for <strong>${service || "Other"}</strong>. Our team will contact you within 24 hours.</p>
      <p><strong>Your details:</strong></p>
      <ul>
        <li>Phone: ${phone}</li>
        <li>Email: ${email}</li>
      </ul>
      <p>Best regards,<br>Danzup Studio Team</p>
    `;

    // Attempt to send emails asynchronously so we don't block the user's request
    Promise.all([
      sendEmail(process.env.ADMIN_EMAIL, "🆕 New Danzup Studio Inquiry", adminEmailHtml),
      sendEmail(email, "Thank You - Danzup Studio", userEmailHtml)
    ]).catch(err => {
      console.warn("⚠️ Email sending experienced an issue:", err.message);
    });

    res.json({
      success: true,
      message: "Inquiry submitted successfully! We'll contact you soon.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
