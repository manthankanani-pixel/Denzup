const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Copy Logo from brain folder on startup if available
const fs = require("fs");
const path = require("path");
const logoSrc = "C:/Users/Admin/.gemini/antigravity-ide/brain/aea861a5-a295-40f9-9db9-fabea5a6aa34/media__1780553820593.jpg";
const logoDst = path.join(__dirname, "danzup-logo.png");
if (fs.existsSync(logoSrc)) {
  try {
    fs.copyFileSync(logoSrc, logoDst);
    console.log("✅ Logo image successfully initialized on startup.");
  } catch (err) {
    console.error("❌ Logo copy error:", err.message);
  }
}

// Validate environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "EMAIL_USER",
  "EMAIL_PASS",
  "ADMIN_EMAIL",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingVars.join(", "),
  );
  console.error(
    "Please check your .env file and ensure all required variables are set.",
  );
  process.exit(1);
}

console.log("✅ Environment variables validated");

const contactRoutes = require("./routes/contact");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Multer setup for logo upload
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ".");
  },
  filename: function (req, file, cb) {
    cb(null, "danzup-logo.png");
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload-logo", upload.single("logo"), (req, res) => {
  res.json({ success: true, message: "Logo uploaded successfully" });
});

// Serve static files (HTML, CSS, JS, images)
app.use(express.static("."));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test email endpoint (equivalent to the user's PHP mail test snippet)
app.get("/api/test-email", async (req, res) => {
  const { sendEmail } = require("./models/utils/email");
  const to = "recipient@example.com";
  const subject = "Test Email";
  const message = "This is a test email message.";

  const success = await sendEmail(to, subject, message);
  if (success) {
    res.json({ success: true, message: "Email sent successfully!" });
  } else {
    res.status(500).json({ success: false, message: "Email failed to send." });
  }
});

// Database Connection & Server Startup
const dbManager = require("./models/utils/db");

dbManager.init().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
