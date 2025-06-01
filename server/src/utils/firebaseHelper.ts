import { db } from "@/config/firebase";
import { normalizePhoneNumber } from "./phoneHelper";

export const getUserRef = (phoneNumber: string) => {
  const normalized = normalizePhoneNumber(phoneNumber);
  return db.ref(`users/${normalized}`);
};

export const clearAccessCode = async (ref: any) => {
  await ref.update({
    accessCode: "",
    accessCodeCreatedAt: null,
  });
};
