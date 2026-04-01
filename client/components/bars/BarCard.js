import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import { useNavigation } from "@react-navigation/native";
import BarProfileScreen from "../../screens/BarProfile/BarProfileScreen";
import useNeonPulse from "../../hooks/useNeonPulse";

export default function BarCard({ name, vibe, neighborhood, onPress }) {
  const navigation = useNavigation();
  const neonPulse = useNeonPulse();

  // Press feedback animation
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, mass: 1 });
    opacity.value = withSpring(0.9, { damping: 15, mass: 1 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, mass: 1 });
    opacity.value = withSpring(1, { damping: 15, mass: 1 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16, // 8px * 2
    marginBottom: 16, // 8px * 2
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
    paddingVertical: 8, // 8px * 1
    paddingHorizontal: 12, // 8px * 1.5
    borderWidth: 1,
    borderColor: colors.neonYellow,
    marginLeft: 8, // 8px
  },

  vibeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.neonYellow,
    letterSpacing: 0.5,
  },

  neighborhood: {
    ...typography.caption,
    marginTop: 8, // 8px
  },
});
