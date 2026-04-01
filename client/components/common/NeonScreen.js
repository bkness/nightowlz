import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
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
      <Animated.View style={fadeInStyle}>{children}</Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
