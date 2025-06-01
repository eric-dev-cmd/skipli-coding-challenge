import { parsePhoneNumberFromString } from "libphonenumber-js";

export const normalizePhoneNumber = (input: string): string => {
  const phoneNumber = parsePhoneNumberFromString(input, "VN");

  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error(
      "Invalid phone number format. Only Vietnamese phone numbers are supported (e.g., +84337934563)."
    );
  }

  if (phoneNumber.country !== "VN") {
    throw new Error("Only Vietnamese phone numbers are supported.");
  }

  return phoneNumber.number;
};
