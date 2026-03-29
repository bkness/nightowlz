// ThemeProvider.js
import React, { createContext, useContext, useState, useMemo } from "react";
import { Appearance } from "react-native";
import colors from "./colors";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Detect system color scheme
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemScheme || "dark");

  // No palette switching yet; always use default colors
  const themeColors = colors;

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, colors: themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Optional: custom hook for easy access
export function useTheme() {
  return useContext(ThemeContext);
}
