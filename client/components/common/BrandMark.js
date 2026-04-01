import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import {
  BrandMarkAltCircle,
  BrandMarkAltBadge,
  BrandMarkAltPin,
  BrandMarkAltArc,
  BrandMarkAltFeather,
} from "../unused/logo-marks";

export default function BrandMark({
  size = 74,
  animated = true,
  variant = "circle",
}) {
  if (variant === "circle") return <BrandMarkAltCircle size={size} />;
  if (variant === "pin") return <BrandMarkAltPin size={size} />;
  if (variant === "arc") return <BrandMarkAltArc size={size} />;
  if (variant === "feather") return <BrandMarkAltFeather size={size} />;
  if (variant === "badge") return <BrandMarkAltBadge size={size} />;
  console.log(
    "Invalid variant prop for BrandMark. Expected 'circle', 'badge', 'pin', 'arc', or 'feather'. Defaulting to 'badge'.",
  );
  console.log(
    "Recieved Size:",
    size,
    "Animated:",
    animated,
    "Variant:",
    variant,
  );
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

  return (
    <Animated.View
      style={[styles.logoWrap, animated && { opacity, transform: [{ scale }] }]}
    >
      <MaterialCommunityIcons
        name="bird"
        size={wingSize}
        color={colors.neonOrange}
      />
      <View
        style={[
          styles.pill,
          {
            width: size,
            height: size,
          },
        ]}
      >
        <Ionicons name="beer" size={beerSize} color={colors.neonOrange} />
      </View>
      <MaterialCommunityIcons
        name="bird"
        size={wingSize}
        color={colors.neonOrange}
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
    borderRadius: 999,
    borderWidth: 1.6,
    borderColor: colors.secondaryPurple,
    backgroundColor: "rgba(162, 89, 255, 0.2)",
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.86,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  rightWing: {
    transform: [{ rotateY: "180deg" }],
  },
});
