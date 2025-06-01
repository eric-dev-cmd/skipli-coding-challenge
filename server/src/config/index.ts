import dotenv from "dotenv";

// Load environment variables
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  // Firebase (backend admin SDK)
  firebase: {
    databaseUrl: requireEnv("FIREBASE_DATABASE_URL"),
    credentialsPath: requireEnv("GOOGLE_APPLICATION_CREDENTIALS"),
  },
  firebaseServer: {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    measurementId: process.env.FIREBASE_MEASUREMENTID || "",
  },
  twilio: {
    accountSid: requireEnv("TWILIO_ACCOUNT_SID"),
    authToken: requireEnv("TWILIO_AUTH_TOKEN"),
    fromPhoneNumber: requireEnv("TWILIO_FROM_PHONE"),
    toPhoneNumber: requireEnv("TWILIO_TO_PHONE"),
  },
  githubApiToken: process.env.GITHUB_API_TOKEN || "",
  corsOrigin: process.env.CORS_ORIGIN,
  rateLimit: {
    otp: {
      windowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MS || "60000", 10),
      maxRequests: parseInt(process.env.OTP_RATE_LIMIT_MAX_REQUESTS || "3", 10),
    },
    github: {
      windowMs: parseInt(
        process.env.GITHUB_RATE_LIMIT_WINDOW_MS || "60000",
        10
      ),
      maxRequests: parseInt(
        process.env.GITHUB_RATE_LIMIT_MAX_REQUESTS || "60",
        10
      ),
    },
    userProfile: {
      windowMs: parseInt(
        process.env.USER_PROFILE_RATE_LIMIT_WINDOW_MS || "60000",
        10
      ),
      maxRequests: parseInt(
        process.env.USER_PROFILE_RATE_LIMIT_MAX_REQUESTS || "30",
        10
      ),
    },
    swagger: {
      windowMs: parseInt(
        process.env.SWAGGER_RATE_LIMIT_WINDOW_MS || "60000",
        10
      ),
      maxRequests: parseInt(
        process.env.SWAGGER_RATE_LIMIT_MAX_REQUESTS || "10",
        10
      ),
    },
  },
};
