import { Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function NeonButton({ title, onPress }) {
  const scaleValue = useSharedValue(1);
  const shadowOpacityValue = useSharedValue(1);

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.96, {
      damping: 15,
      mass: 1,
      overshootClamping: false,
    });
    shadowOpacityValue.value = withSpring(0.7, { damping: 15, mass: 1 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15, mass: 1 });
    shadowOpacityValue.value = withSpring(1, { damping: 15, mass: 1 });
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    shadowOpacity: shadowOpacityValue.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.animatedContainer, animatedButtonStyle]}>
        <LinearGradient
          colors={[colors.neonOrange, colors.neonYellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },

  animatedContainer: {
    borderRadius: 16,
    shadowColor: colors.glowYellow,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },

  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",

    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.34)",
  },

  text: {
    ...typography.buttonLabel,
  },
});
