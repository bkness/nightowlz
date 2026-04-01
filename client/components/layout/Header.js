import React from "react";
import { View, Text, StyleSheet } from "react-native";
import typography from "../../theme/typography";
import { BrandMark } from "../common";

export default function Header({ compact = false }) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <BrandMark size={86} animated={true} />
      <Text style={styles.tagline}>Find Your Night</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  compact: {
    marginTop: 12,
    marginBottom: 8,
  },
  tagline: {
    ...typography.screenSubtitle,
    marginTop: 8,
  },
});
