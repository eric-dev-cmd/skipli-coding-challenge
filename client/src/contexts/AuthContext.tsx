import React, { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  login: (phoneNumber: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phoneNumber, setPhoneNumber, clearPhoneNumber] =
    useLocalStorage<string>("phoneNumber", "");
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (phoneNumber) {
      setUser({ id: phoneNumber, name: phoneNumber });
    } else {
      setUser(null);
    }
  }, [phoneNumber]);

  const login = (phone: string) => {
    setPhoneNumber(phone);
  };

  const logout = () => {
    clearPhoneNumber();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!phoneNumber,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
