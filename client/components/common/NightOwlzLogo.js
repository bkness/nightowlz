import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../theme/colors";

export default function NightOwlzLogo({ compact = false }) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.iconRing}>
        <Ionicons
          name="moon"
          size={26}
          color={colors.neonBlue}
          style={styles.moon}
        />
        <MaterialCommunityIcons
          name="owl"
          size={22}
          color={colors.neonYellow}
        />
      </View>
      <View>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>
          NightOwlz
        </Text>
        <Text style={styles.tagline}>Find your night</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wrapCompact: {
    gap: 10,
  },
  iconRing: {
    width: 46,
    height: 46,
    marginTop: 2,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.45)",
    backgroundColor: "rgba(7, 10, 22, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.glowBlue,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  moon: {
    position: "absolute",
    left: 7,
    top: 4,
    opacity: 0.95,
  },
  wordmark: {
    color: colors.neonYellow,
    fontFamily: "Pacifico",
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: 0.4,
    textShadowColor: colors.glowOrange,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  wordmarkCompact: {
    fontSize: 26,
    lineHeight: 28,
  },
  tagline: {
    color: colors.neonBlue,
    fontFamily: "Lobster",
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.2,
    marginTop: -3,
    textShadowColor: colors.glowBlue,
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
});
