import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

export default function BrandMarkAltBadge({ size = 84 }) {
  const core = Math.round(size * 0.72);

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.badge,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <View
          style={[
            styles.core,
            { width: core, height: core, borderRadius: core / 2 },
          ]}
        >
          <Ionicons
            name="beer"
            size={Math.round(size * 0.38)}
            color={colors.neonOrange}
          />
        </View>
      </View>
      <MaterialCommunityIcons
        name="bird"
        size={Math.round(size * 0.34)}
        color={colors.neonOrange}
        style={styles.leftWing}
      />
      <MaterialCommunityIcons
        name="bird"
        size={Math.round(size * 0.34)}
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
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.neonPurple,
    backgroundColor: "rgba(162, 89, 255, 0.18)",
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.85,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  core: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 147, 46, 0.44)",
    backgroundColor: "rgba(20, 10, 42, 0.8)",
  },
  leftWing: {
    position: "absolute",
    left: -24,
    top: "36%",
  },
  rightWing: {
    position: "absolute",
    right: -24,
    top: "36%",
    transform: [{ rotateY: "180deg" }],
  },
});
