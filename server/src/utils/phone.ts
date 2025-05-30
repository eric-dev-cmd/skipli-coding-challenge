export const normalizePhoneNumber = (phone: string): string => {
  return phone.startsWith("0") ? phone.replace(/^0/, "+84") : phone;
};
