import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import themeColors from "../../theme/colors";
import surfaces from "../../theme/surfaces";
import typography from "../../theme/typography";

export default function SlidingPanel({
  isVisible,
  onClose,
  snapPoints = ["28%", "58%"],
  title = "Details",
  children,
}) {
  const insets = useSafeAreaInsets();
  const animatedIndex = useSharedValue(isVisible ? 0 : -1);
  const animatedPosition = useSharedValue(0);

  useEffect(() => {
    animatedIndex.value = isVisible ? 0 : -1;
  }, [isVisible, animatedIndex]);

  return (
    <BottomSheet
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      snapPoints={snapPoints}
      initialSnapIndex={isVisible ? 0 : -1}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.sheet}
    >
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom + 16 }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Swipe down to close</Text>
        </View>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
  },
  sheetBackground: {
    ...surfaces.sheetBackground,
  },
  handleIndicator: {
    backgroundColor: themeColors.neonYellow,
    width: 48,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
  },
  header: {
    gap: 4,
    marginBottom: 8,
  },
  title: {
    ...typography.screenTitle,
    fontSize: 28,
    lineHeight: 34,
    textAlign: "left",
    color: themeColors.neonYellow,
  },
  subtitle: {
    ...typography.screenSubtitle,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "left",
    color: themeColors.muted,
  },
});
