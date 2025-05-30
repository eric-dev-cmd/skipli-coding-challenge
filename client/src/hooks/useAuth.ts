import { useLocalStorage } from "@/hooks/useLocalStorage";

export const useAuth = () => {
  const [phoneNumber] = useLocalStorage<string>("phoneNumber", "");

  return {
    isAuthenticated: !!phoneNumber,
    loading: false,
    user: phoneNumber ? { id: phoneNumber, name: phoneNumber } : null,
  };
};
