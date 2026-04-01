import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function BarCard({
  name,
  vibe,
  neighborhood,
  onPress,
  distance,
  category,
  icon = "owl",
}) {
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
        <View style={styles.topRow}>
          <View style={styles.thumbWrap}>
            <MaterialCommunityIcons
              name={icon}
              size={26}
              color={colors.neonYellow}
            />
          </View>

          <View style={styles.contentCol}>
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>

            <View style={styles.vibeTagInline}>
              <Text style={styles.vibeText} numberOfLines={1}>
                {vibe}
              </Text>
            </View>

            <View style={styles.metaRow}>
              {!!distance && <Text style={styles.metaText}>{distance}</Text>}
              {!!distance && !!neighborhood && (
                <Text style={styles.metaDot}>•</Text>
              )}
              {!!neighborhood && (
                <Text style={styles.metaText}>{neighborhood}</Text>
              )}
            </View>

            {!!category && <Text style={styles.category}>{category}</Text>}
          </View>
        </View>

        <View style={styles.bottomGlowLine} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.28)",
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    minHeight: 134,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  thumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.25)",
    marginRight: 12,
  },

  contentCol: {
    flex: 1,
    paddingRight: 2,
  },

  name: {
    ...typography.subheading,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 0.2,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  metaText: {
    ...typography.caption,
    fontSize: 14,
    color: colors.muted,
  },

  metaDot: {
    color: colors.navInactive,
    marginHorizontal: 6,
    fontSize: 12,
  },

  category: {
    ...typography.caption,
    color: colors.navInactive,
    marginTop: 4,
    fontSize: 13,
  },

  vibeTagInline: {
    backgroundColor: "rgba(255, 184, 92, 0.15)",
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.neonYellow,
    maxWidth: 220,
    marginTop: 6,
    alignSelf: "flex-start",
  },

  vibeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.neonYellow,
    letterSpacing: 0.3,
  },

  bottomGlowLine: {
    marginTop: 14,
    height: 2,
    width: "100%",
    borderRadius: 99,
    backgroundColor: "rgba(123, 223, 255, 0.22)",
  },
});
