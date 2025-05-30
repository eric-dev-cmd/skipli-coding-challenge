export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phone);
};

export const isValidAccessCode = (code: string) => {
  return /^\d{6}$/.test(code);
};
