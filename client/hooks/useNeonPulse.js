import { Animated } from "react-native";
import { useRef, useEffect } from "react";

export default function useNeonPulse(duration = 1500) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow, duration]);

  const style = {
    textShadowRadius: glow.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 20],
    }),
  };

  return style;
}
