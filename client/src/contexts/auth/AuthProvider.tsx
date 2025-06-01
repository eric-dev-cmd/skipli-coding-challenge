import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [storedPhoneNumber, setStoredPhoneNumber, clearStoredPhoneNumber] =
    useLocalStorage<string>("phoneNumber", "");

  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (storedPhoneNumber) {
      setUser({ id: storedPhoneNumber, name: storedPhoneNumber });
    } else {
      setUser(null);
    }
  }, [storedPhoneNumber]);

  const login = (phone: string) => {
    setStoredPhoneNumber(phone);
    setUser({ id: phone, name: phone });
  };

  const logout = () => {
    clearStoredPhoneNumber();
    setUser(null);
    toast.success("Logged out successfully", {
      icon: "👋",
      duration: 2000,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
