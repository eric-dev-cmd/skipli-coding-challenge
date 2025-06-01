import { normalizePhoneNumber } from "../utils/phoneHelper";
import { db } from "../config/firebase";
import { generateRandomCode } from "../utils/generateRandomCode";
import { sendSMS } from "./twilio.service";
import { clearAccessCode, getUserRef } from "@/utils/firebaseHelper";

const CODE_EXPIRATION_MINUTES = 5;
const COOLDOWN_MS = 60 * 1000; // 1 phút

export const createNewAccessCodeService = async (inputPhoneNumber: string) => {
  const phoneNumber = normalizePhoneNumber(inputPhoneNumber);
  const ref = getUserRef(inputPhoneNumber);
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  const now = Date.now();

  if (
    data?.accessCodeCreatedAt &&
    now - data.accessCodeCreatedAt < COOLDOWN_MS
  ) {
    const secondsLeft = Math.ceil(
      (COOLDOWN_MS - (now - data.accessCodeCreatedAt)) / 1000
    );
    throw new Error(
      `Please wait ${secondsLeft} seconds before requesting another code.`
    );
  }

  const code = generateRandomCode();

  await ref.update({
    accessCode: code,
    accessCodeCreatedAt: now,
  });

  try {
    await sendSMS(phoneNumber, `Your access code is: ${code}`);
  } catch (smsError: any) {
    console.error(
      `[SMS_ERROR] Failed to send code to ${phoneNumber}`,
      smsError
    );
    throw new Error("Failed to send SMS. Please try again later.");
  }

  return code;
};

export const validateAccessCodeService = async (
  inputPhoneNumber: string,
  code: string
) => {
  const ref = getUserRef(inputPhoneNumber);
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  const storedCode = data?.accessCode;
  const createdAt = data?.accessCodeCreatedAt;

  if (!storedCode || storedCode !== code) {
    throw new Error("Invalid code. Please try again.");
  }

  const now = Date.now();
  const expirationTime = createdAt + CODE_EXPIRATION_MINUTES * 60 * 1000;

  if (now > expirationTime) {
    await clearAccessCode(ref);
    throw new Error("Access code expired");
  }

  await clearAccessCode(ref);
};
