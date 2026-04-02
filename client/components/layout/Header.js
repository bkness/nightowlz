import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NightOwlzLogo from "../common/NightOwlzLogo";

export default function Header({ compact = false }) {
  const insets = useSafeAreaInsets();
  const topOffset = Math.max(insets.top + (compact ? 6 : 10), 22);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600 }),
        withTiming(0, { duration: 1600 }),
      ),
      -1,
      false,
    );
  }, [glowPulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      glowPulse.value,
      [0, 1],
      [0.3, 0.7],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[
        pulseStyle,
        styles.container,
        { paddingTop: topOffset },
        compact && styles.compact,
      ]}
    >
      <NightOwlzLogo compact={compact} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    overflow: "visible",
    shadowColor: "rgba(123, 223, 255, 0.3)",
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  compact: {
    marginTop: 0,
    marginBottom: 12,
  },
});
