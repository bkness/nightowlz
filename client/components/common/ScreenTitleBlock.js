import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import typography from "../../theme/typography";
import defaultColors from "../../theme/colors";
import { getSafeTopOffset } from "../../theme/layout";

export default function ScreenTitleBlock({
  title,
  subtitle,
  colors = defaultColors,
  style,
  useSafeTopInset = true,
  topInsetPadding = 8,
  minTopInset = 20,
}) {
  const insets = useSafeAreaInsets();
  const topOffset = useSafeTopInset
    ? getSafeTopOffset(insets.top, {
        basePadding: topInsetPadding,
        min: minTopInset,
      })
    : 0;

  return (
    <View style={[styles.container, { paddingTop: topOffset }, style]}>
      <Text
        style={[
          typography.screenTitle,
          { color: colors.neonYellow },
        ]}
      >
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
