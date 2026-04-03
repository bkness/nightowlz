import React from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TAB_ORDER = ["Discover", "Events", "MyBars", "MyProfile", "Settings"];
const SWIPE_THRESHOLD = 70;
const DRAG_RESISTANCE = 0.35;

export default function SwipeTabWrapper({ children }) {
  const navigation = useNavigation();
  const route = useRoute();
  const translateX = useSharedValue(0);
  const routeName = route.name;

  const navigateToIndex = (index) => {
    navigation.navigate(TAB_ORDER[index]);
  };

  const pan = Gesture.Pan()
    // Start handling only intentional horizontal drags.
    .minDistance(5)
    .activeOffsetX([-15, 15])
    .onUpdate((event) => {
      // Follow finger slightly for a smoother horizontal drag feel.
      translateX.value = event.translationX * DRAG_RESISTANCE;
    })
    .onEnd((event) => {
      const index = TAB_ORDER.indexOf(routeName);

      if (index >= 0) {
        if (
          event.translationX < -SWIPE_THRESHOLD &&
          index < TAB_ORDER.length - 1
        ) {
          runOnJS(navigateToIndex)(index + 1);
        } else if (event.translationX > SWIPE_THRESHOLD && index > 0) {
          runOnJS(navigateToIndex)(index - 1);
        }
      }

      translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
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
