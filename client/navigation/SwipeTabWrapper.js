import React, { useRef } from "react";
import { View } from "react-native";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const SWIPE_THRESHOLD = 70;
const SWIPE_LOCK_MS = 260;

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
    // Start handling only intentional horizontal drags.
    .minDistance(5)
    .activeOffsetX([-15, 15])
    .onEnd((event) => {
      if (!isFocused) return;
      if (isTransitioningRef.current) return;
      const index = tabOrder.indexOf(routeName);

      if (index >= 0) {
        if (
          event.translationX < -SWIPE_THRESHOLD &&
          index < tabOrder.length - 1
        ) {
          isTransitioningRef.current = true;
          navigateToIndex(index + 1);
        } else if (event.translationX > SWIPE_THRESHOLD && index > 0) {
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
