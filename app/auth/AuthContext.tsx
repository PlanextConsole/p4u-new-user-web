"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  loggedPhone: string;
  isLoading: boolean;
  login: (phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedPhone, setLoggedPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    const saved = localStorage.getItem("p4u_loggedIn");
    const phone = localStorage.getItem("p4u_phone");
    if (saved === "true" && phone) {
      setIsLoggedIn(true);
      setLoggedPhone(phone);
    }
    setIsLoading(false);  
  }, []);

  function login(phone: string) {
    setIsLoggedIn(true);
    setLoggedPhone(phone);
    localStorage.setItem("p4u_loggedIn", "true");
    localStorage.setItem("p4u_phone", phone);
  }

  function logout() {
    setIsLoggedIn(false);
    setLoggedPhone("");
    localStorage.removeItem("p4u_loggedIn");
    localStorage.removeItem("p4u_phone");
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loggedPhone, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}