import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config";
import githubRoutes from "./routes/github.routes";
import accessCodeRoutes from "./routes/accessCode.routes";
import userRoutes from "./routes/user.routes";
import { db } from "./config/firebase";
import { server } from "./server";

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
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate Limiters Configuration
const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
      errorCode: "RATE_LIMIT_EXCEEDED",
    },
    // Skip successful requests from counting against rate limit
    skipSuccessfulRequests: false,
    // Skip failed requests from counting against rate limit
    skipFailedRequests: false,
  });
};

// Rate Limiters
const otpRateLimiter = createRateLimiter(
  config.rateLimit.otp.windowMs,
  config.rateLimit.otp.maxRequests,
  "Too many OTP requests. Please try again later."
);

const githubRateLimiter = createRateLimiter(
  config.rateLimit.github.windowMs,
  config.rateLimit.github.maxRequests,
  "Too many GitHub API requests. Please slow down."
);

const userProfileRateLimiter = createRateLimiter(
  config.rateLimit.userProfile.windowMs,
  config.rateLimit.userProfile.maxRequests,
  "Too many profile requests. Please try again later."
);

const swaggerRateLimiter = createRateLimiter(
  config.rateLimit.swagger.windowMs,
  config.rateLimit.swagger.maxRequests,
  "Too many documentation requests."
);

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());
app.use(logger("dev"));

// Swagger documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.use(
  "/api/docs",
  swaggerRateLimiter,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Routes
app.use("/api/auth", otpRateLimiter, accessCodeRoutes);
app.use("/api/github", githubRateLimiter, githubRoutes);
app.use("/api/user", userProfileRateLimiter, userRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });
});

export default app;
