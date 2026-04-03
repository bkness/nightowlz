import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { surfaces, typography } from "../../theme";

export default function EmptyStateCard({
  title,
  subtitle,
  titleStyle,
  subtitleStyle,
  cardStyle,
  icon,
  children,
}) {
  return (
    <View style={[styles.card, cardStyle]}>
      {icon}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...surfaces.neonCard,
    padding: 24,
    alignItems: "center",
  },
  title: {
    ...typography.subheading,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
  },
});
