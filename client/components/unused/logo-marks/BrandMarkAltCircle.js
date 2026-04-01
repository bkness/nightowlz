import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

export default function BrandMarkAltCircle({ size = 84 }) {
  const wingSize = Math.round(size * 0.44);
  const mugSize = Math.round(size * 0.42);

  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons
        name="bird"
        size={wingSize}
        color={colors.neonOrange}
      />
      <View
        style={[
          styles.outerRing,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <View style={[styles.innerRing, { borderRadius: size / 2 }]}>
          <Ionicons name="beer" size={mugSize} color={colors.neonOrange} />
        </View>
      </View>
      <MaterialCommunityIcons
        name="bird"
        size={wingSize}
        color={colors.neonOrange}
        style={styles.rightWing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.8,
    borderColor: colors.secondaryPurple,
    backgroundColor: "rgba(162, 89, 255, 0.14)",
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  innerRing: {
    width: "84%",
    height: "84%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 146, 46, 0.4)",
    backgroundColor: "rgba(10, 6, 22, 0.5)",
  },
  rightWing: {
    transform: [{ rotateY: "180deg" }],
  },
});
