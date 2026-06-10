import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

const SESSION_KEY = "auth-session";

async function persistSession(session) {
  try {
    if (session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  } catch (error) {
    console.warn("Failed to persist session:", error?.message);
  }
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Restore a saved session on launch so users stay logged in across restarts.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_KEY);
        if (active && stored) {
          const session = JSON.parse(stored);
          if (session?.token) {
            setToken(session.token);
            setUser(session.user || null);
            setRole(session.user?.role || session.role || "user");
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.warn("Failed to restore session:", error?.message);
      } finally {
        if (active) setIsHydrating(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = (nextRole = "user", nextSession = null) => {
    setIsLoggedIn(true);
    setRole(nextRole);

    if (nextSession) {
      setToken(nextSession.token || null);
      setUser(nextSession.user || null);
      persistSession({
        token: nextSession.token || null,
        user: nextSession.user || null,
        role: nextRole,
      });
    }
  };

  const setSession = (session = {}) => {
    const nextRole = session.user?.role || "user";
    setIsLoggedIn(true);
    setToken(session.token || null);
    setUser(session.user || null);
    setRole(nextRole);
    persistSession({
      token: session.token || null,
      user: session.user || null,
      role: nextRole,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setToken(null);
    setUser(null);
    persistSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, token, user, isHydrating, login, setSession, logout }}
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
