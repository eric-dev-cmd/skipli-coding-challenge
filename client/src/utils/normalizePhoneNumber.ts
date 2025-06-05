// ============================================================================
// GIẢI PHÁP PHONE VALIDATION CÓ THỂ MỞ RỘNG ĐA QUỐC GIA
// ============================================================================

// 1. CONFIGURATION-BASED APPROACH
// Định nghĩa config cho từng quốc gia
interface CountryPhoneConfig {
  code: string; // Mã quốc gia
  countryCode: string; // Country code (+84, +1, +86...)
  localPrefix: string; // Prefix địa phương (0, 1...)
  mobileLength: number; // Độ dài số mobile
  landlineLength?: number; // Độ dài số bàn (optional)
  pattern: RegExp; // Pattern validation
}

// Config hiện tại (chỉ Việt Nam)
export const PHONE_CONFIGS: Record<string, CountryPhoneConfig> = {
  VN: {
    code: "VN",
    countryCode: "+84",
    localPrefix: "0",
    mobileLength: 9,
    landlineLength: 10,
    pattern: /^(\+84[0-9]{9,10}|0[0-9]{9,10})$/,
  },
  // Để mở rộng đa quốc gia, chỉ cần thêm config:
  // US: {
  //   code: 'US',
  //   countryCode: '+1',
  //   localPrefix: '1',
  //   mobileLength: 10,
  //   pattern: /^(\+1[0-9]{10}|1[0-9]{10})$/
  // },
  // CN: {
  //   code: 'CN',
  //   countryCode: '+86',
  //   localPrefix: '0',
  //   mobileLength: 11,
  //   pattern: /^(\+86[0-9]{11}|0[0-9]{10})$/
  // }
};

// ============================================================================
// 2. CORE VALIDATION FUNCTIONS
// ============================================================================

// Hiện tại: Single country validation
export const isValidPhoneNumber = (
  phone: string,
  countryCode: string = "VN"
) => {
  const config = PHONE_CONFIGS[countryCode];
  if (!config) return false;

  return config.pattern.test(phone);
};

// Normalize phone number theo country
export const normalizePhoneNumber = (
  phone: string,
  countryCode: string = "VN"
): string => {
  const config = PHONE_CONFIGS[countryCode];
  if (!config) return phone;

  const cleaned = phone.replace(/[^\d+]/g, "");

  // If starts with local prefix (0, 1...), replace with country code
  if (cleaned.startsWith(config.localPrefix)) {
    return config.countryCode + cleaned.substring(config.localPrefix.length);
  }

  // If already starts with country code, keep as is
  if (cleaned.startsWith(config.countryCode.replace("+", ""))) {
    return "+" + cleaned;
  }

  // If starts with +country code, keep as is
  if (cleaned.startsWith(config.countryCode)) {
    return cleaned;
  }

  return cleaned;
};
