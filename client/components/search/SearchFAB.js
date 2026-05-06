import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";

const BUTTON_SIZE = 58;

function SonarRing({ delay }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(3, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.5, { duration: 200 }), withTiming(0, { duration: 1800 })),
        -1,
        false
      )
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.ring, animatedStyle]} />;
}

export default function SearchFAB({ onPress }) {
  return (
    <Animated.View
      entering={FadeIn.duration(600).delay(800)}
      style={styles.container}
      pointerEvents="box-none"
    >
      <SonarRing delay={0} />
      <SonarRing delay={700} />
      <SonarRing delay={1400} />
      <Pressable onPress={onPress} style={styles.button}>
        <Ionicons name="search" size={22} color={colors.background} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 29,
    right: 24,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.neonYellow,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors.neonYellow,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.neonYellow,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
});
