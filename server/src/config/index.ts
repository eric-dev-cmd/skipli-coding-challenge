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
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // default 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },
};
