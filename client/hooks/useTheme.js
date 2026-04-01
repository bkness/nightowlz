import { useContext } from "react";
import { ThemeContext } from "../theme/themeProvider";

export default function useTheme() {
  return useContext(ThemeContext);
}
