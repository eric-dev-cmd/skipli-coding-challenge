import { PHONE_CONFIGS } from "./normalizePhoneNumber";

// Hiện tại: Single country validation
export const isValidPhoneNumber = (
  phone: string,
  countryCode: string = "VN"
) => {
  const config = PHONE_CONFIGS[countryCode];
  if (!config) return false;

  return config.pattern.test(phone);
};

export const isValidAccessCode = (code: string) => {
  return /^\d{6}$/.test(code);
};
