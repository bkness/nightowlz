import React, { useRef } from "react";
import { View } from "react-native";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const SWIPE_THRESHOLD = 70;
const SWIPE_LOCK_MS = 260;
const SWIPE_VELOCITY_THRESHOLD = 520;
const SWIPE_MIN_DISTANCE_FOR_FLICK = 20;
const HORIZONTAL_INTENT_MULTIPLIER = 1.15;

export default function SwipeTabWrapper({ children, tabOrder = [] }) {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const isTransitioningRef = useRef(false);
  const routeName = route.name;

  const navigateToIndex = (index) => {
    const targetRoute = tabOrder[index];

    if (targetRoute && typeof navigation.jumpTo === "function") {
      navigation.jumpTo(targetRoute);
    }
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(isFocused && tabOrder.length > 1)
    .maxPointers(1)
    // Start handling only intentional horizontal drags.
    .minDistance(5)
    .activeOffsetX([-15, 15])
    .failOffsetY([-12, 12])
    .onEnd((event) => {
      if (!isFocused) return;
      if (isTransitioningRef.current) return;

      const absX = Math.abs(event.translationX);
      const absY = Math.abs(event.translationY);
      const horizontalIntent =
        absX > Math.max(24, absY * HORIZONTAL_INTENT_MULTIPLIER);

      if (!horizontalIntent) return;

      const swipeLeft =
        event.translationX < -SWIPE_THRESHOLD ||
        (event.velocityX < -SWIPE_VELOCITY_THRESHOLD &&
          absX >= SWIPE_MIN_DISTANCE_FOR_FLICK);
      const swipeRight =
        event.translationX > SWIPE_THRESHOLD ||
        (event.velocityX > SWIPE_VELOCITY_THRESHOLD &&
          absX >= SWIPE_MIN_DISTANCE_FOR_FLICK);

      const index = tabOrder.indexOf(routeName);

      if (index >= 0) {
        if (swipeLeft && index < tabOrder.length - 1) {
          isTransitioningRef.current = true;
          navigateToIndex(index + 1);
        } else if (swipeRight && index > 0) {
          isTransitioningRef.current = true;
          navigateToIndex(index - 1);
        }
      }

      if (isTransitioningRef.current) {
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, SWIPE_LOCK_MS);
      }
    });

  return (
    <View style={styles.clipContainer}>
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.container}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = {
  clipContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    width: "100%",
  },
};
