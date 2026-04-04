import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (nextRole = "user", nextSession = null) => {
    setIsLoggedIn(true);
    setRole(nextRole);

    if (nextSession) {
      setToken(nextSession.token || null);
      setUser(nextSession.user || null);
    }
  };

  const setSession = (session = {}) => {
    setIsLoggedIn(true);
    setToken(session.token || null);
    setUser(session.user || null);
    setRole(session.user?.role || "user");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, token, user, login, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
