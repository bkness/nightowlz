import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

function getLabelStyle(focused, color) {
  if (focused) {
    return [
      typography.label,
      { color: colors.white, fontWeight: "700", fontSize: 11.5 },
      styles.glow(color),
    ];
  }
  return [typography.label, { color, fontSize: 10.5 }];
}

export default function NeonTabIcon({ name, label, focused, color }) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={name}
        size={focused ? 27 : 23}
        color={color}
        style={focused ? styles.glow(color) : null}
      />
      {focused ? (
        <View
          style={[
            styles.pill,
            { borderColor: color + "88", backgroundColor: color + "1F" },
          ]}
        >
          <Text
            style={[getLabelStyle(true, color), { textAlign: "center" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit={true}
            allowFontScaling={true}
          >
            {label}
          </Text>
        </View>
      ) : (
        <Text
          style={[getLabelStyle(false, color), { textAlign: "center" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit={true}
          allowFontScaling={true}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    marginTop: 20,
    minWidth: 74,
    height: 52,
  },

  glow: (color) => ({
    textShadowColor: color,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  }),
  pill: {
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 3,
    marginBottom: 0,
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
