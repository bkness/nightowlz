import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function NeonScreen({ children, gradient, liftDistance = 14 }) {
  const fadeInValue = useSharedValue(0);
  const ambientPulse = useSharedValue(0);

  useEffect(() => {
    fadeInValue.value = withTiming(1, { duration: 320 });
    ambientPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3200 }),
        withTiming(0, { duration: 3200 }),
      ),
      -1,
      false,
    );
  }, [ambientPulse, fadeInValue]);

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      fadeInValue.value,
      [0, 1],
      [0.7, 1],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          fadeInValue.value,
          [0, 1],
          [liftDistance, 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const ambientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      ambientPulse.value,
      [0, 1],
      [0.84, 1],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          ambientPulse.value,
          [0, 1],
          [0, -5],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.ambientWrap, ambientStyle]}
      >
        <LinearGradient
          colors={[
            "rgba(255, 122, 26, 0)",
            "rgba(255, 122, 26, 0.18)",
            "rgba(255, 79, 216, 0.10)",
            "rgba(255, 79, 216, 0)",
          ]}
          style={styles.bottomGlow}
        />
        <LinearGradient
          colors={[
            "rgba(162, 89, 255, 0)",
            "rgba(162, 89, 255, 0.14)",
            "rgba(162, 89, 255, 0)",
          ]}
          style={styles.midHaze}
        />
      </Animated.View>
      <Animated.View style={[styles.content, fadeInStyle]}>
        {children}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0a0a0a",
  },
  ambientWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
  bottomGlow: {
    position: "absolute",
    left: -24,
    right: -24,
    bottom: -40,
    height: 260,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
  },
  midHaze: {
    position: "absolute",
    left: 36,
    right: 36,
    bottom: 180,
    height: 120,
    borderRadius: 120,
  },
});
