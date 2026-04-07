import { Easing } from "react-native";
import { colors } from "../../theme";

export const authStackOptions = {
  headerShown: false,
  animation: "fade",
  gestureEnabled: false,
};

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

export const transparentModalScreenOptions = {
  title: "Settings",
  presentation: "transparentModal",
  headerShown: false,
  contentStyle: { backgroundColor: "transparent" },
};