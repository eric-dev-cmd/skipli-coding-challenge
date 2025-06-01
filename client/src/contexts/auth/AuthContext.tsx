import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  login: (phoneNumber: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
