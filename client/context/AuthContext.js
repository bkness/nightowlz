import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../utils/apiBaseUrl";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    // __DEV__
    //     ? { email: "dev@barfly.com", role: "user", name: "Dev User" }
    //     : null,
    null,
  );
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    // if (__DEV__) return; // Skip loading from storage in dev mode
    const storedUser = await AsyncStorage.getItem("user");
    const storedToken = await AsyncStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  };

  // Register new user with backend
  const signUp = async ({ username, email, password, role = "user" }) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        role,
      });
      // Optionally auto-login after sign up
      const loginResult = await login({ identifier: email, password });
      if (!loginResult.ok) return loginResult;
      return { ok: true, message: "Account created." };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Error registering user",
      };
    }
  };

  // Login user with backend (identifier = username or email)
  const login = async ({ identifier, password }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password,
      });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);
      return { ok: true, message: "Logged in." };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Error logging in",
      };
    }
  };

  // Logout user
  const logout = async () => {
    // if (__DEV__) return; // Don't log out in dev mode
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
