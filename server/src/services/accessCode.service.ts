import { normalizePhoneNumber } from "../utils/phone";
import { db } from "../config/firebase.config";
import { generateRandomCode } from "../utils/generateRandomCode";

const CODE_EXPIRATION_MINUTES = 5;

export const createNewAccessCodeService = async (inputPhoneNumber: string) => {
  const phoneNumber = normalizePhoneNumber(inputPhoneNumber);
  const ref = db.ref(`users/${phoneNumber}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  const now = Date.now();
  if (data?.accessCodeCreatedAt && now - data.accessCodeCreatedAt < 60 * 1000) {
    throw new Error("Please wait before requesting another code");
  }

  const code = generateRandomCode();
  await ref.update({
    accessCode: code,
    accessCodeCreatedAt: now,
  });
  return code;
};

export const validateAccessCodeService = async (
  inputPhoneNumber: string,
  code: string
) => {
  const phoneNumber = normalizePhoneNumber(inputPhoneNumber);
  const ref = db.ref(`users/${phoneNumber}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  const storedCode = data?.accessCode;
  const createdAt = data?.accessCodeCreatedAt;

  if (!storedCode || storedCode !== code) {
    throw new Error("Invalid access code");
  }

  const now = Date.now();
  const expirationTime = createdAt + CODE_EXPIRATION_MINUTES * 60 * 1000;

  if (now > expirationTime) {
    await ref.update({ accessCode: "", accessCodeCreatedAt: null });
    throw new Error("Access code expired");
  }

  await ref.update({ accessCode: "", accessCodeCreatedAt: null });
};
