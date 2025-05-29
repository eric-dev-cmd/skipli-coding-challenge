import express, { Request, Response } from "express";
import fs from "fs";

const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const YAML = require("yamljs");
const logger = require("morgan");
const createError = require("http-errors");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const admin = require("firebase-admin");
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const rawKey = fs.readFileSync(serviceAccountPath!, "utf-8");
const serviceAccount = JSON.parse(rawKey);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// For Realtime Database
const db = admin.database();
db.ref("test-connection")
  .set({ status: "ok", timestamp: new Date().toISOString() })
  .then(() => {
    console.log(
      "✅ Connected to Firebase Realtime Database and wrote test data."
    );
  })
  .catch(() => {
    console.error("❌ Failed to connect to Firebase Realtime Database:");
  });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(logger("dev"));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`⚠️ Rate limit exceeded by IP: ${req.ip}`);
    res.status(429).json({ message: "Too many requests. Please wait." });
  },
});
app.use("/api", apiLimiter);

// Swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import routes
const authRoutes = require("./routes/authRoutes.js");
const githubRoutes = require("./routes/githubRoutes");
const userRoutes = require("./routes/userRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/user", userRoutes);
app.get("/api/", (req: Request, res: Response) => {
  res.send("Hello TypeScript with Express");
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handling middleware
app.use(function (err: any, req: Request, res: Response) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: req.app.get("env") === "development" ? err : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
