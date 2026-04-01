import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

export default function BrandMarkAltPin({ size = 90 }) {
  const pinSize = Math.round(size * 0.76);

  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons
        name="bird"
        size={Math.round(size * 0.32)}
        color={colors.neonOrange}
        style={styles.leftWing}
      />
      <Ionicons
        name="location-sharp"
        size={pinSize}
        color={colors.neonBlue}
        style={styles.pin}
      />
      <View style={styles.core}>
        <Ionicons
          name="beer"
          size={Math.round(size * 0.34)}
          color={colors.neonOrange}
        />
      </View>
      <MaterialCommunityIcons
        name="bird"
        size={Math.round(size * 0.32)}
        color={colors.neonOrange}
        style={styles.rightWing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  pin: {
    textShadowColor: colors.glowBlue,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  core: {
    position: "absolute",
    top: "36%",
    alignItems: "center",
    justifyContent: "center",
  },
  leftWing: {
    position: "absolute",
    left: 8,
    top: "35%",
  },
  rightWing: {
    position: "absolute",
    right: 8,
    top: "35%",
    transform: [{ rotateY: "180deg" }],
  },
});
