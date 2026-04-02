import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NightOwlzLogo from "../common/NightOwlzLogo";

export default function Header({ compact = false }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 10) },
        compact && styles.compact,
      ]}
    >
      <NightOwlzLogo compact={compact} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    overflow: "visible",
  },
  compact: {
    marginTop: -2,
    marginBottom: 14,
  },
});
