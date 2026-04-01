import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

export default function BrandMarkAltFeather({ size = 88 }) {
  const core = Math.round(size * 0.78);

  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons
        name="feather"
        size={Math.round(size * 0.26)}
        color={colors.neonOrange}
        style={styles.leftWing}
      />
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
            size={Math.round(size * 0.4)}
            color={colors.neonOrange}
          />
        </View>
      </View>
      <MaterialCommunityIcons
        name="feather"
        size={Math.round(size * 0.26)}
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
    borderWidth: 1.8,
    borderColor: colors.neonPurple,
    backgroundColor: "rgba(162, 89, 255, 0.18)",
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  core: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 147, 46, 0.44)",
    backgroundColor: "rgba(20, 10, 42, 0.75)",
  },
  leftWing: {
    position: "absolute",
    left: -18,
    top: "38%",
    transform: [{ rotate: "-20deg" }],
  },
  rightWing: {
    position: "absolute",
    right: -18,
    top: "38%",
    transform: [{ scaleX: -1 }, { rotate: "-20deg" }],
  },
});
