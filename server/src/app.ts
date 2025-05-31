import express from "express";

import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config";
import githubRoutes from "./routes/github.routes";
import accessCodeRoutes from "./routes/accessCode.routes";
import userRoutes from "./routes/user.routes";
import { db } from "./config/firebase.config";
import { notFound } from "./middleware/notFound";

const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const YAML = require("yamljs");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");

// test Firebase connection
(async () => {
  try {
    await db
      .ref("test-connection")
      .set({ status: "ok", timestamp: new Date().toISOString() });
    // console.log("✅ Firebase OK");
  } catch (err) {
    // console.error("❌ Firebase failed:", err);
  }
})();

// Initialize Express app
const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const otpRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errorCode: "RATE_LIMIT_EXCEEDED",
  },
});

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(logger("dev"));

// Swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", otpRateLimiter, accessCodeRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/user-profile", userRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
