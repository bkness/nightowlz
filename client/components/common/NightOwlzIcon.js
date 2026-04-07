import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import themeColors from "../../theme/colors";

const OWL_MARK = require("../../assets/images/Niceeee.png");

/**
 * Icon-only version of NightOwlzLogo
 * Used for: tab bar, profile avatar ring, bar profile accent
 */
export default function NightOwlzIcon({
  size = 32,
  color = themeColors.neonYellow,
  glowColor = themeColors.glowBlue,
  glowEnabled = false,
  focused = true,
  glowAnimation = null, // Optional shared value from parent for pulse effect
}) {
  const ringSize = size;
  const ringRadius = size / 2;
  const markSize = size * 0.86;

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
            borderColor: glowEnabled ? "rgba(123, 223, 255, 0.62)" : "rgba(123, 223, 255, 0.28)",
            shadowColor: glowEnabled ? glowColor : color,
            shadowOpacity: glowEnabled ? 0.5 : focused ? 0.3 : 0.12,
            shadowRadius: size * 0.4,
          },
        ]}
      >
        <Image
          source={OWL_MARK}
          resizeMode="contain"
          style={[
            styles.mark,
            {
              width: markSize,
              height: markSize,
              opacity: glowEnabled || focused ? 1 : 0.56,
            },
          ]}
          accessibilityRole="image"
          accessibilityLabel="Night Owlz icon"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 1,
    backgroundColor: "rgba(7, 10, 22, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
  },
  mark: {
    marginTop: -0.5,
  },
});
