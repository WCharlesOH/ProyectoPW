// src/auth/AuthContext.tsx

import React, { createContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isLogged: boolean;
  user: unknown | null;
  login: (userData: unknown) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<unknown | null>(null);
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

  function login(userData: unknown) {
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}