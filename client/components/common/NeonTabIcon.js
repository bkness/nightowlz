import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function NeonTabIcon({ name, label, focused, color }) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={name}
        size={26}
        color={color}
        style={focused ? styles.glow(color) : null}
      />
      <Text
        style={[
          typography.label,

          { color },
          focused ? styles.glow(color) : null, // ⬅️ add this
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  glow: (color) => ({
    textShadowColor: color,
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  }),
});
