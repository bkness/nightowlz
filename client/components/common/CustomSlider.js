import React, { useRef } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";

const SLIDER_WIDTH = 260;
const THUMB_SIZE = 28;

export default function CustomSlider({
  min = 0,
  max = 100,
  value = 0,
  onValueChange = () => {},
  trackColor = "#ccc",
  thumbColor = "#ffb300",
}) {
  const pan = useRef(
    new Animated.Value(
      ((value - min) / (max - min)) * (SLIDER_WIDTH - THUMB_SIZE),
    ),
  ).current;

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(pan.__getValue());
      },
      onPanResponderMove: (e, gesture) => {
        let newX = clamp(
          gesture.dx + pan.__getValue(),
          0,
          SLIDER_WIDTH - THUMB_SIZE,
        );
        pan.setValue(newX);
        const newValue =
          min + (newX / (SLIDER_WIDTH - THUMB_SIZE)) * (max - min);
        onValueChange(Math.round(newValue));
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  // Update thumb position if value prop changes
  React.useEffect(() => {
    const newX = ((value - min) / (max - min)) * (SLIDER_WIDTH - THUMB_SIZE);
    pan.setValue(newX);
  }, [value, min, max]);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: trackColor }]} />
      <Animated.View
        style={[
          styles.thumb,
          { backgroundColor: thumbColor, transform: [{ translateX: pan }] },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    top: (THUMB_SIZE - 6) / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: 0,
    left: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
