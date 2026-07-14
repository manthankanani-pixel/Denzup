const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const copyFileOnStartup = (src, dest, successMsg) => {
  if (fs.existsSync(src)) {
    try {
      fs.copyFileSync(src, dest);
      console.log(successMsg);
    } catch (err) {
      console.error(`❌ Copy error for ${path.basename(dest)}:`, err.message);
    }
  }
};

copyFileOnStartup(
  "C:/Users/Admin/.gemini/antigravity-ide/brain/aea861a5-a295-40f9-9db9-fabea5a6aa34/media__1780553820593.jpg",
  path.join(__dirname, "danzup-logo.png"),
  "✅ Logo image successfully initialized on startup.",
);

copyFileOnStartup(
  "C:/Users/Admin/.gemini/antigravity-ide/brain/ffb91a55-8468-41aa-9fed-b55b66823f56/media__1780831840977.png",
  path.join(__dirname, "hardik.png"),
  "✅ Owner Hardik photo successfully initialized on startup.",
);

copyFileOnStartup(
  "C:/Users/Admin/.gemini/antigravity-ide/brain/ffb91a55-8468-41aa-9fed-b55b66823f56/media__1780831849057.png",
  path.join(__dirname, "akash.png"),
  "✅ Owner Akash photo successfully initialized on startup.",
);

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

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// Explicitly set a clean, modern Permissions-Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=*, camera=*, microphone=*, payment=*, accelerometer=*, gyroscope=*, magnetometer=*",
  );
  next();
});
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: "Too many requests, please try again later." }
});
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload-logo", upload.single("logo"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No logo file uploaded." });
  }

  // In Vercel's read-only runtime, files cannot be written to disk.
  // Use req.file.buffer to upload the data to cloud storage or process it in memory.
  return res.json({
    success: true,
    message: "Logo received in memory successfully.",
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });
});

app.use((req, res, next) => {
  const pathLower = req.path.toLowerCase();
  if (
    pathLower.includes("/.env") ||
    pathLower.includes("admin-config.json") ||
    pathLower.includes("package.json") ||
    pathLower.includes("package-lock.json") ||
    pathLower.includes("/data/")
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Access to sensitive configuration data is blocked.",
    });
  }
  next();
});

app.use(express.static(path.join(__dirname, "dist")));

app.get(
  ["/danzup-logo.png", "/hardik.png", "/akash.png", "/hero-dancer.jpeg"],
  (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
  },
);

app.get("/admin.html", (req, res) => {
  res.redirect("/admin");
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    version: "updated-v2",
    timestamp: new Date().toISOString(),
  });
});

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

const dbManager = require("./models/utils/db");

dbManager.init().catch((err) => {
  console.error("❌ Failed to initialize DB:", err);
  process.exit(1);
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const handler = (req, res) => app(req, res);

module.exports = handler;
module.exports.default = handler;
module.exports.handler = handler;
