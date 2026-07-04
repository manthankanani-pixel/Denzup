const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const dbManager = require("../models/utils/db");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "danzup-default-jwt-secret-key-2026";
const CONFIG_PATH = path.join(__dirname, "../data/admin-config.json");

async function getAdminCredentials() {
  try {
    const data = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {
      email: process.env.ADMIN_EMAIL || "admin@danzupstudio.com",
      password: process.env.ADMIN_PASSWORD || "admin123"
    };
  }
}

async function saveAdminCredentials(email, password) {
  const dir = path.dirname(CONFIG_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify({ email, password }, null, 2), "utf8");
}

const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("JWT Auth error:", error.message);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const creds = await getAdminCredentials();

    if (email !== creds.email || password !== creds.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      success: true,
      message: "Login successful!",
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});

router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const stats = await dbManager.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching stats." });
  }
});

router.get("/contacts", authenticateAdmin, async (req, res) => {
  try {
    const contacts = await dbManager.getContacts();
    res.json({
      success: true,
      data: contacts,
      total: contacts.length
    });
  } catch (error) {
    console.error("Contacts fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching contacts." });
  }
});

router.post("/contacts/create", authenticateAdmin, async (req, res) => {
  try {
    const { firstName, lastName, phone, email, address, service, message } = req.body;

    if (!firstName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (First Name, Phone, and Email are required)."
      });
    }

    const name = lastName ? `${firstName} ${lastName}` : firstName;

    const contact = await dbManager.saveContact({
      name,
      firstName,
      lastName,
      phone,
      email,
      address: address || "",
      service: service || "Other",
      message: message || "Walk-in inquiry"
    });

    console.log("📝 Manually created contact inquiry saved:", contact);

    const { sendEmail } = require("../models/utils/email");
    const userEmailHtml = `
      <h2>Thank You for Visiting Danzup Studio! 🎉</h2>
      <p>Hi ${firstName},</p>
      <p>It was great meeting you today! We've registered your interest in <strong>${service || "Other"}</strong>.</p>
      <p>Our team will contact you soon to finalize your class booking.</p>
      <p>Best regards,<br>Danzup Studio Team</p>
    `;
    sendEmail(email, "Thank You for Visiting - Danzup Studio", userEmailHtml).catch(err => {
      console.warn("⚠️ Customer welcome email failed to send:", err.message);
    });

    res.json({
      success: true,
      message: "Offline inquiry added successfully!",
      contact
    });
  } catch (error) {
    console.error("Manual contact creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
});


router.put("/contacts/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const contact = await dbManager.updateContactStatus(req.params.id, status);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found." });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error("Contact status update error:", error);
    res.status(500).json({ success: false, message: "Update failed." });
  }
});

router.get("/bookings", authenticateAdmin, async (req, res) => {
  try {
    const bookings = await dbManager.getBookings();
    res.json({
      success: true,
      data: bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching bookings." });
  }
});

router.put("/bookings/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status, paid } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const booking = await dbManager.updateBookingStatus(req.params.id, status, paid);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (status === "confirmed") {
      const { sendEmail } = require("../models/utils/email");
      const userEmailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 30px; border-radius: 8px; border: 1px solid #D4AF37; max-width: 600px; margin: auto;">
          <h2 style="color: #D4AF37; font-family: 'Playfair Display', Georgia, serif; text-align: center; font-size: 24px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 15px; margin-bottom: 20px; letter-spacing: 2px;">DANZUP STUDIO</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hi ${booking.name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #E2E8F0;">We are thrilled to let you know that your class booking has been <strong>CONFIRMED</strong>! 🎉</p>
          
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #D4AF37; margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: bold; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 8px; font-family: 'Playfair Display', Georgia, serif;">Class Booking Details</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #94A3B8; width: 120px; font-weight: 500;">Class / Service:</td>
                <td style="padding: 6px 0; color: #F8FAFC; font-weight: bold;">${booking.service}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94A3B8; font-weight: 500;">Batch / Slot:</td>
                <td style="padding: 6px 0; color: #F8FAFC; font-weight: bold;">${booking.batch}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94A3B8; font-weight: 500;">Class Date:</td>
                <td style="padding: 6px 0; color: #F8FAFC; font-weight: bold;">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94A3B8; font-weight: 500;">Payment Status:</td>
                <td style="padding: 6px 0; color: ${booking.paid ? '#4ADE80' : '#FBBF24'}; font-weight: bold;">${booking.paid ? "Paid (Success)" : "Pending Payment / Trial"}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #CBD5E1;">Please arrive at the studio 10 minutes before the scheduled time. If you have any questions, feel free to reply directly to this email or call us.</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #D4AF37; font-weight: bold; margin-top: 25px; margin-bottom: 0;">We look forward to dancing with you!</p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-top: 5px;">Best regards,<br>Danzup Studio Team</p>
        </div>
      `;
      sendEmail(booking.email, "Booking Confirmed - Danzup Studio", userEmailHtml).catch(err => {
        console.warn("⚠️ Booking confirmation email failed to send:", err.message);
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking status update error:", error);
    res.status(500).json({ success: false, message: "Update failed." });
  }
});

router.post("/bookings/create", authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, email, service, batch, date, paid, status } = req.body;

    if (!name || !phone || !email || !service || !batch || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (Name, Phone, Email, Class/Service, Batch, and Date are required)."
      });
    }

    const booking = await dbManager.saveBooking({
      name,
      phone,
      email,
      service,
      batch,
      date,
      paid: !!paid,
      status: status || 'confirmed'
    });

    console.log("📝 Manually created booking saved:", booking);

    const { sendEmail } = require("../models/utils/email");
    const userEmailHtml = `
      <h2>Class Booking Confirmation! 🎉</h2>
      <p>Hi ${name},</p>
      <p>We've successfully registered your booking for <strong>${service}</strong>.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Batch: ${batch}</li>
        <li>Date: ${date}</li>
        <li>Status: ${status || 'confirmed'}</li>
        <li>Payment Status: ${paid ? "Paid" : "Unpaid"}</li>
      </ul>
      <p>We look forward to seeing you at Danzup Studio!</p>
      <p>Best regards,<br>Danzup Studio Team</p>
    `;
    sendEmail(email, "Class Booking Registered - Danzup Studio", userEmailHtml).catch(err => {
      console.warn("⚠️ Client booking confirmation email failed to send:", err.message);
    });

    res.json({
      success: true,
      message: "Offline booking registered successfully!",
      booking
    });
  } catch (error) {
    console.error("Manual booking creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
});

router.get("/fees", authenticateAdmin, async (req, res) => {
  try {
    const fees = await dbManager.getFees();
    res.json({
      success: true,
      data: fees,
      total: fees.length
    });
  } catch (error) {
    console.error("Fees fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching fees." });
  }
});

router.post("/fees/create", authenticateAdmin, async (req, res) => {
  try {
    const { studentName, phone, email, service, totalAmount, paidAmount, paymentMethod, dueDate, notes } = req.body;

    if (!studentName || !phone || !email || !service || !totalAmount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (Name, Phone, Email, Service, Total Fee, and Due Date are required)."
      });
    }

    const fee = await dbManager.saveFee({
      studentName,
      phone,
      email,
      service,
      totalAmount,
      paidAmount,
      paymentMethod,
      dueDate,
      notes
    });

    res.json({
      success: true,
      message: "Fee record created successfully!",
      data: fee
    });
  } catch (error) {
    console.error("Fee create error:", error);
    res.status(500).json({ success: false, message: "Error creating fee record." });
  }
});

router.post("/fees/:id/payments", authenticateAdmin, async (req, res) => {
  try {
    const { amount, method, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than zero."
      });
    }

    const fee = await dbManager.addPaymentToFee(req.params.id, { amount, method, notes });
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee ledger not found."
      });
    }

    res.json({
      success: true,
      message: "Payment transaction recorded successfully!",
      data: fee
    });
  } catch (error) {
    console.error("Fee payment record error:", error);
    res.status(500).json({ success: false, message: "Error recording payment transaction." });
  }
});

router.delete("/fees/:id", authenticateAdmin, async (req, res) => {
  try {
    const fee = await dbManager.deleteFee(req.params.id);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found."
      });
    }

    res.json({
      success: true,
      message: "Fee ledger deleted successfully!"
    });
  } catch (error) {
    console.error("Fee delete error:", error);
    res.status(500).json({ success: false, message: "Error deleting fee record." });
  }
});

router.get("/me", authenticateAdmin, async (req, res) => {
  res.json({
    success: true,
    email: req.admin.email
  });
});

router.put("/change-credentials", authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: "Current password is required to save changes." });
    }

    const creds = await getAdminCredentials();
    if (currentPassword !== creds.password) {
      return res.status(401).json({ success: false, message: "Current password verification failed." });
    }

    const emailToSave = newEmail ? newEmail.trim() : creds.email;
    const passwordToSave = newPassword ? newPassword : creds.password;

    if (!emailToSave) {
      return res.status(400).json({ success: false, message: "Admin login email cannot be empty." });
    }

    await saveAdminCredentials(emailToSave, passwordToSave);

    res.json({
      success: true,
      message: "Credentials updated successfully! Please log in with new credentials."
    });
  } catch (error) {
    console.error("Change credentials error:", error);
    res.status(500).json({ success: false, message: "Failed to update credentials." });
  }
});

module.exports = router;
