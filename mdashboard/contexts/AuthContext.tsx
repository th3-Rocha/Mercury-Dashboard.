"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { validateToken } from "@/lib/api";
import { AuthContextType, User } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsChecking(false);
      return;
    }

    try {
      const response = await validateToken();

      if (response.success && response.data?.valid && response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Error validating token:", err);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isChecking, user, setUser, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
