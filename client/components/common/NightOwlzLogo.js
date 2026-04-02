import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "../../theme/colors";

export default function NightOwlzLogo({ compact = false }) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.iconRing}>
        <Ionicons
          name="moon"
          size={26}
          color={themeColors.neonBlue}
          style={styles.moon}
        />
        <MaterialCommunityIcons
          name="owl"
          size={22}
          color={themeColors.neonYellow}
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
    overflow: "visible",
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
    shadowColor: themeColors.glowBlue,
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
    color: themeColors.neonYellow,
    fontFamily: "Pacifico",
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 0.4,
    paddingTop: 2,
    textShadowColor: themeColors.glowOrange,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  wordmarkCompact: {
    fontSize: 42,
    lineHeight: 55,
  },
  tagline: {
    color: themeColors.neonBlue,
    fontFamily: "Lobster",
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.2,
    marginTop: -1,
    textShadowColor: themeColors.glowBlue,
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
});
