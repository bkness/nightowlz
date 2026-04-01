import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function NeonScreen({ children, gradient }) {
  const fadeInValue = useSharedValue(0);

  useEffect(() => {
    fadeInValue.value = withTiming(1, { duration: 400 });
  }, [fadeInValue]);

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
          [20, 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <View pointerEvents="none" style={styles.ambientWrap}>
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
      </View>
      <Animated.View style={fadeInStyle}>{children}</Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  ambientWrap: {
    ...StyleSheet.absoluteFillObject,
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
