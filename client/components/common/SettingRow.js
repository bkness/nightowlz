import React from "react";
import { View, Text, StyleSheet } from "react-native";
import typography from "../../theme/typography";

export default function SettingRow({
  label,
  colors,
  showDivider = true,
  children,
}) {
  return (
    <View style={[styles.row, !showDivider && styles.rowNoDivider]}>
      <Text style={[typography.body, { color: colors.white }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  rowNoDivider: {
    borderBottomWidth: 0,
  },
});
