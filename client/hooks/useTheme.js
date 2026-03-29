import { useColorScheme } from "react-native";
import colors from "./colors";
import gradients from "./gradients";
import typography from "./typography";

export const useTheme = () => {
  const scheme = useColorScheme(); // "light" or "dark"
  return {
    colors: colors[scheme],
    gradients,
    typography,
  };
};
