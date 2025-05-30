import { parsePhoneNumberFromString } from "libphonenumber-js";

export const normalizePhoneNumber = (input: string): string => {
  const phoneNumber = parsePhoneNumberFromString(input);
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Invalid phone number format");
  }
  return phoneNumber.number;
};
