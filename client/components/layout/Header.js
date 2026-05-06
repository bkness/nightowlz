import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NightOwlzLogo from "../common/NightOwlzLogo";
import { getSafeTopOffset } from "../../theme/layout";

const HEADER_TOKENS = {
  compactBasePadding: 12,
  basePadding: 40,
  compactMinInset: 20,
  minInset: 30,
};

export default function Header({ compact = false }) {
  const insets = useSafeAreaInsets();
  const topOffset = getSafeTopOffset(insets.top, {
    basePadding: compact ? HEADER_TOKENS.compactBasePadding : HEADER_TOKENS.basePadding,
    min: compact ? HEADER_TOKENS.compactMinInset : HEADER_TOKENS.minInset,
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topOffset, overflow: "visible" },
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
    marginBottom: 12,
  },
});
