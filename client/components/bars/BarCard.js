import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "../../theme/colors";
import surfaces from "../../theme/surfaces";
import typography from "../../theme/typography";

function BarCard({
  name,
  vibe,
  neighborhood,
  onPress,
  distance,
  category,
  sourceLabel,
  icon = "owl",
  showSaveAction = false,
  isSaved = false,
  onToggleSave,
}) {
  // Press feedback animation
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const lift = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.985, { damping: 18, stiffness: 220, mass: 1 });
    opacity.value = withSpring(0.9, { damping: 15, mass: 1 });
    lift.value = withSpring(2, { damping: 18, stiffness: 220, mass: 1 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 220, mass: 1 });
    opacity.value = withSpring(1, { damping: 15, mass: 1 });
    lift.value = withSpring(0, { damping: 18, stiffness: 220, mass: 1 });
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
              color={themeColors.neonYellow}
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
              {!!distance && (
                <Text style={styles.metaText} numberOfLines={1}>{distance}</Text>
              )}
              {!!distance && !!neighborhood && (
                <Text style={styles.metaDot}>•</Text>
              )}
              {!!neighborhood && (
                <Text style={[styles.metaText, styles.metaNeighborhood]} numberOfLines={1}>{neighborhood}</Text>
              )}
            </View>

            {!!sourceLabel && <Text style={styles.sourceLabel}>{sourceLabel}</Text>}
          </View>

          {showSaveAction && (
            <TouchableOpacity
              onPress={onToggleSave}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.heartButton}
            >
              <MaterialCommunityIcons
                name={isSaved ? "heart" : "heart-outline"}
                size={22}
                color={isSaved ? themeColors.neonYellow : themeColors.muted}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomGlowLine} />
      </Pressable>
    </Animated.View>
  );
}

const areEqual = (prev, next) => {
  return (
    prev.name === next.name &&
    prev.vibe === next.vibe &&
    prev.neighborhood === next.neighborhood &&
    prev.distance === next.distance &&
    prev.category === next.category &&
    prev.sourceLabel === next.sourceLabel &&
    prev.icon === next.icon &&
    prev.isSaved === next.isSaved &&
    prev.showSaveAction === next.showSaveAction &&
    prev.onToggleSave === next.onToggleSave &&
    prev.onPress === next.onPress
  );
};

export default React.memo(BarCard, areEqual);

const styles = StyleSheet.create({
  card: {
    ...surfaces.neonCard,
    padding: 18,
    marginBottom: 16,
    minHeight: 134,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  thumbWrap: {
    ...surfaces.subtleThumb,
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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
    color: themeColors.muted,
    flexShrink: 0,
  },

  metaNeighborhood: {
    flex: 1,
    flexShrink: 1,
  },

  metaDot: {
    color: themeColors.navInactive,
    marginHorizontal: 6,
    fontSize: 12,
  },

  category: {
    ...typography.caption,
    color: themeColors.navInactive,
    marginTop: 4,
    fontSize: 13,
  },

  sourceLabel: {
    ...typography.caption,
    color: themeColors.neonBlue,
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  vibeTagInline: {
    ...surfaces.chipAmber,
    paddingVertical: 7,
    paddingHorizontal: 10,
    maxWidth: 220,
    marginTop: 6,
    alignSelf: "flex-start",
  },

  vibeText: {
    fontSize: 13,
    fontWeight: "700",
    color: themeColors.neonYellow,
    letterSpacing: 0.3,
  },

  bottomGlowLine: {
    ...surfaces.glowDividerBlue,
    marginTop: 14,
    width: "100%",
  },

  heartButton: {
    padding: 4,
    marginLeft: 8,
    alignSelf: "flex-start",
  },
});
