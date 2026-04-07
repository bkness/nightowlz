import { Easing } from "react-native";
import { colors } from "../../theme";

export const baseStackScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  contentStyle: { backgroundColor: colors.background },
  headerTintColor: colors.neonYellow,
  gestureEnabled: true,
  gestureDirection: "horizontal",
  animation: "fade_from_bottom",
  animationDuration: 350,
  animationEasing: Easing.out(Easing.quad),
};

export const authScreenOptions = {
  headerShown: false,
  animation: "fade",
  gestureEnabled: false,
};

export const transparentModalScreenOptions = {
  title: "Settings",
  presentation: "transparentModal",
  headerShown: false,
  contentStyle: { backgroundColor: "transparent" },
};