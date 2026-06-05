const express = require("express");
const jwt = require("jsonwebtoken");
const dbManager = require("../models/utils/db");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "danzup-default-jwt-secret-key-2026";

// Auth Middleware to protect admin routes
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

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@danzupstudio.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Sign JWT token valid for 24h
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

// Get dashboard stats (Protected)
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

// Get all contacts/inquiries (Protected)
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

// Update contact/inquiry status (Protected)
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

// Get all bookings (Protected)
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

// Update booking status and paid status (Protected)
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

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking status update error:", error);
    res.status(500).json({ success: false, message: "Update failed." });
  }
});

module.exports = router;
