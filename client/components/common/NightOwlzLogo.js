import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import themeColors from "../../theme/colors";

const OWL_MARK = require("../../assets/images/Niceeee.png");

const LOGO_TOKENS = {
  gap: 10,
  compactGap: 8,
  markFrame: 64,
  compactMarkFrame: 52,
  mark: 58,
  compactMark: 46,
  wordmarkSize: 28,
  wordmarkLine: 34,
  compactWordmarkSize: 24,
  compactWordmarkLine: 30,
  taglineSize: 16,
  taglineLine: 20,
  compactTaglineSize: 15,
  compactTaglineLine: 18,
};

export default function NightOwlzLogo({ compact = false }) {
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100 }),
        withTiming(0, { duration: 1100 }),
      ),
      -1,
      false,
    );
  }, [glowPulse]);

  const markPulseStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      glowPulse.value,
      [0, 1],
      [0.22, 0.45],
      Extrapolate.CLAMP,
    ),
    shadowRadius: interpolate(
      glowPulse.value,
      [0, 1],
      [7, 12],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Animated.View style={[styles.markGlow, markPulseStyle]}>
        <View style={[styles.markFrame, compact && styles.markFrameCompact]}>
          <Image
            source={OWL_MARK}
            resizeMode="contain"
            style={[styles.mark, compact && styles.markCompact]}
            accessibilityRole="image"
            accessibilityLabel="Night Owlz owl mark"
          />
        </View>
      </Animated.View>
      <View style={styles.textWrap}>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>
          Night Owlz
        </Text>
        <Text style={[styles.tagline, compact && styles.taglineCompact]}>
          Find your night
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: LOGO_TOKENS.gap,
    overflow: "visible",
  },
  textWrap: {
    overflow: "visible",
  },
  wrapCompact: {
    gap: LOGO_TOKENS.compactGap,
  },
  markGlow: {
    overflow: "visible",
    shadowColor: themeColors.glowBlue,
    shadowOffset: { width: 0, height: 0 },
  },
  markFrame: {
    width: LOGO_TOKENS.markFrame,
    height: LOGO_TOKENS.markFrame,
    marginRight: 4,
    marginTop: 1,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.35)",
    backgroundColor: "rgba(7, 10, 22, 0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  markFrameCompact: {
    width: LOGO_TOKENS.compactMarkFrame,
    height: LOGO_TOKENS.compactMarkFrame,
    marginRight: 3,
    borderRadius: 26,
  },
  mark: {
    width: LOGO_TOKENS.mark,
    height: LOGO_TOKENS.mark,
  },
  markCompact: {
    width: LOGO_TOKENS.compactMark,
    height: LOGO_TOKENS.compactMark,
  },
  wordmark: {
    color: themeColors.neonYellow,
    fontFamily: "Pacifico",
    fontSize: LOGO_TOKENS.wordmarkSize,
    lineHeight: LOGO_TOKENS.wordmarkLine,
    letterSpacing: 0.4,
    paddingTop: 2,
  },
  wordmarkCompact: {
    fontSize: LOGO_TOKENS.compactWordmarkSize,
    lineHeight: LOGO_TOKENS.compactWordmarkLine,
  },
  tagline: {
    color: themeColors.neonBlue,
    fontFamily: "Lobster",
    fontSize: LOGO_TOKENS.taglineSize,
    lineHeight: LOGO_TOKENS.taglineLine,
    letterSpacing: 0.2,
    marginTop: 0,
  },
  taglineCompact: {
    fontSize: LOGO_TOKENS.compactTaglineSize,
    lineHeight: LOGO_TOKENS.compactTaglineLine,
  },
});
