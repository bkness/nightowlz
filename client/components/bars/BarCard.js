import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import { useNavigation } from "@react-navigation/native";
import BarProfileScreen from "../../screens/BarProfile/BarProfileScreen";
import useNeonPulse from "../../hooks/useNeonPulse";

export default function BarCard({ name, vibe, neighborhood, onPress }) {
  const navigation = useNavigation();
  const neonPulse = useNeonPulse();

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.vibeTag}>
          <Animated.Text style={[styles.vibeText, neonPulse]}>
            {vibe}
          </Animated.Text>
        </View>
      </View>
      <Text style={styles.neighborhood}>{neighborhood}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.05)", // subtle glass
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,

    // Neon border + glow
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.35)",
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    ...typography.subheading,
    flexShrink: 1,
  },

  vibeTag: {
    backgroundColor: "rgba(255, 184, 92, 0.15)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.neonYellow,
  },

  vibeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.neonYellow,
    letterSpacing: 0.5,
  },

  neighborhood: {
    ...typography.caption,
    marginTop: 6,
  },
});
