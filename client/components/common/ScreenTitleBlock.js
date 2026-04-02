import React from "react";
import { View, Text, StyleSheet } from "react-native";
import typography from "../../theme/typography";
import defaultColors from "../../theme/colors";

export default function ScreenTitleBlock({
  title,
  subtitle,
  colors = defaultColors,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.screenTitle, { color: colors.neonYellow }]}>
        {title}
      </Text>
      <Text style={[typography.screenSubtitle, { color: colors.neonBlue }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 44,
    marginBottom: 32,
  },
});
