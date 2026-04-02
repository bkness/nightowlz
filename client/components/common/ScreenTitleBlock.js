import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import typography from "../../theme/typography";
import defaultColors from "../../theme/colors";

export default function ScreenTitleBlock({
  title,
  subtitle,
  colors = defaultColors,
  style,
}) {
  const insets = useSafeAreaInsets();
  const topOffset = Math.max(insets.top + 10, 24);

  return (
    <View style={[styles.container, { paddingTop: topOffset }, style]}>
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
    marginTop: 0,
    marginBottom: 24,
  },
});
