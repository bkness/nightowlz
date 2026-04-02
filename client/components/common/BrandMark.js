import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "../../theme/colors";

export default function BrandMark({
  size = 74,
  animated = true,
  variant = "circle",
}) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [animated, glow]);

  const opacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.56, 1],
  });

  const scale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.06],
  });

  const wingSize = Math.round(size * 0.42);
  const beerSize = Math.round(size * 0.46);
  const isPin = variant === "pin";
  const isBadge = variant === "badge";

  return (
    <Animated.View
      style={[styles.logoWrap, animated && { opacity, transform: [{ scale }] }]}
    >
      <MaterialCommunityIcons
        name="bird"
        size={wingSize}
        color={themeColors.neonOrange}
      />
      <View
        style={[
          styles.pill,
          {
            width: size,
            height: size,
            borderRadius: isPin ? 22 : 999,
            borderColor: isBadge
              ? themeColors.neonBlue
              : themeColors.neonPurple,
            backgroundColor: isBadge
              ? "rgba(123, 223, 255, 0.16)"
              : "rgba(162, 89, 255, 0.2)",
          },
        ]}
      >
        <Ionicons name="beer" size={beerSize} color={themeColors.neonOrange} />
      </View>
      <MaterialCommunityIcons
        name="bird"
        size={wingSize}
        color={themeColors.neonOrange}
        style={styles.rightWing}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.6,
    shadowColor: themeColors.glowPurple,
    shadowOpacity: 0.76,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  rightWing: {
    transform: [{ rotateY: "180deg" }],
  },
});
