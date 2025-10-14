// src/auth/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLogged: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  // Al montar, puedes verificar si hay token en localStorage u otro medio
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setIsLogged(true);
    }
  }, []);

  function login(userData: any) {
    // Aquí haces la lógica real (llamada a API, etc.)
    setUser(userData);
    setIsLogged(true);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}