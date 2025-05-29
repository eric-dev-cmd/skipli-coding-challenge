import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const rawKey = fs.readFileSync(serviceAccountPath!, "utf-8"); // refactored: safe read
const serviceAccount = JSON.parse(rawKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const db = admin.database(); // refactored
