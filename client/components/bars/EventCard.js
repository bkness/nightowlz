import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function EventCard({ title, when, venue }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{when}</Text>
      <Text style={styles.meta}>{venue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
