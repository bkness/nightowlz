import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

export default function BrandMarkAltArc({ size = 90 }) {
  const wingSize = Math.round(size * 0.28);

  return (
    <View style={[styles.wrap, { width: size + 36, height: size + 10 }]}>
      <View
        style={[
          styles.arcRing,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Ionicons
          name="beer"
          size={Math.round(size * 0.42)}
          color={colors.neonOrange}
        />
      </View>
      <Ionicons
        name="paper-plane-outline"
        size={wingSize}
        color={colors.neonOrange}
        style={styles.leftWing}
      />
      <Ionicons
        name="paper-plane-outline"
        size={wingSize}
        color={colors.neonOrange}
        style={styles.rightWing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  arcRing: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.secondaryPurple,
    backgroundColor: "rgba(162, 89, 255, 0.16)",
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  leftWing: {
    position: "absolute",
    left: 0,
    top: "42%",
    transform: [{ rotate: "-18deg" }],
  },
  rightWing: {
    position: "absolute",
    right: 0,
    top: "42%",
    transform: [{ scaleX: -1 }, { rotate: "-18deg" }],
  },
});
