import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";
import colorPalette from "./colors";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Detect system color scheme
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemScheme || "dark");

  // Use the colors object directly (no light/dark variants needed)
  const themeColors = colorPalette;

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
