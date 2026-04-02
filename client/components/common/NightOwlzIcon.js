import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "../../theme/colors";

/**
 * Icon-only version of NightOwlzLogo
 * Used for: tab bar, profile avatar ring, bar profile accent
 */
export default function NightOwlzIcon({
  size = 32,
  color = themeColors.neonYellow,
  glowColor = themeColors.glowBlue,
  glowEnabled = false,
  glowAnimation = null, // Optional shared value from parent for pulse effect
}) {
  const iconSize = size * 0.65; // Owl/moon relative to ring
  const ringSize = size;
  const ringRadius = size / 2;

  const animatedStyle = useAnimatedStyle(() => {
    if (!glowAnimation) return { opacity: 1 };

    return {
      shadowOpacity: interpolate(
        glowAnimation.value,
        [0, 1],
        [0.3, 0.6],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringRadius,
            shadowColor: glowEnabled ? glowColor : "transparent",
            shadowOpacity: glowEnabled ? 0.5 : 0,
            shadowRadius: size * 0.4,
          },
        ]}
      >
        <Ionicons
          name="moon"
          size={iconSize * 0.85}
          color={glowEnabled ? themeColors.neonBlue : color}
          style={styles.moon}
        />
        <MaterialCommunityIcons
          name="owl"
          size={iconSize}
          color={color}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.45)",
    backgroundColor: "rgba(7, 10, 22, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
  },
  moon: {
    position: "absolute",
    left: "15%",
    top: "8%",
    opacity: 0.95,
  },
});
