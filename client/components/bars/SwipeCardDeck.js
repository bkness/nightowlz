import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import NeonButton from "../common/NeonButton";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import { swipeTabState } from "../../navigation/swipeTabState";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = Math.min(CARD_WIDTH * 1.22, SCREEN_HEIGHT - 420);
const SWIPE_THRESHOLD = 110;

const CATEGORY_CONFIG = {
  bars: { label: "Bar", color: colors.neonYellow },
  clubs: { label: "Club", color: colors.neonPink },
  live_music: { label: "Live Music", color: colors.neonBlue },
  entertainment: { label: "Shows", color: colors.neonViolet },
};

function formatDistance(meters) {
  if (typeof meters !== "number") return "";
  if (meters < 1000) return `${meters} m`;
  const mi = meters / 1609.34;
  return `${mi.toFixed(mi < 10 ? 1 : 0)} mi`;
}

function BarSwipeCard({ bar, savedBarIds, animatedStyle, dimOverlayStyle }) {
  const cat = CATEGORY_CONFIG[bar.category] || { label: bar.category || "Bar", color: colors.neonYellow };
  const isSaved = savedBarIds?.has(String(bar.barId));

  const locationParts = [bar.neighborhood, bar.locality, bar.state].filter(Boolean);
  const distStr = formatDistance(bar.distanceMeters);
  if (distStr) locationParts.push(distStr);

  const subline = bar.openingHours || bar.vibe || "";

  return (
    <Animated.View style={[styles.card, { borderColor: cat.color + "44" }, animatedStyle]}>
      {/* Top row: category chip + saved badge */}
      <View style={styles.cardTop}>
        <View style={[styles.catChip, { borderColor: cat.color }]}>
          <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
        </View>
        {isSaved && (
          <View style={styles.savedBadge}>
            <Ionicons name="star" size={11} color={colors.neonYellow} />
            <Text style={styles.savedBadgeText}>Saved</Text>
          </View>
        )}
      </View>

      {/* Main content */}
      <View style={styles.cardMain}>
        <Text style={styles.barName} numberOfLines={2}>{bar.name}</Text>
        {locationParts.length > 0 && (
          <Text style={styles.barLocation} numberOfLines={1}>{locationParts.join("  ·  ")}</Text>
        )}
        {!!subline && (
          <Text style={styles.barVibe} numberOfLines={1}>{subline}</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerDivider} />
        <View style={styles.footerRow}>
          <Text style={styles.tapHint}>Tap for full profile</Text>
          <Ionicons name="chevron-forward" size={13} color={colors.muted} />
        </View>
      </View>

      {dimOverlayStyle && (
        <Animated.View style={[styles.cardDimOverlay, dimOverlayStyle]} pointerEvents="none">
          {/* Solid layer renders immediately — no BlurView init delay */}
          <View style={[StyleSheet.absoluteFill, styles.cardDimBg]} />
          <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default function SwipeCardDeck({ bars, savedBarIds, onSwipeRight, onCardPress }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const entryProgress = useSharedValue(1); // 0 = middle position, 1 = front position

  // Disable tab-swipe while the deck is active so horizontal card drags don't switch tabs
  useEffect(() => {
    swipeTabState.enabled = false;
    return () => { swipeTabState.enabled = true; };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    translateX.value = 0;
    translateY.value = 0;
    entryProgress.value = 1;
  }, [bars]);

  const handleTap = useCallback(() => {
    onCardPress?.(bars[currentIndexRef.current]);
  }, [bars, onCardPress]);

  const handleSwipe = useCallback((direction) => {
    if (direction > 0) {
      onSwipeRight?.(bars[currentIndexRef.current]);
    }
    setCurrentIndex((i) => i + 1);
    setTimeout(() => {
      entryProgress.value = withSpring(1, { damping: 18, stiffness: 260 });
    }, 0);
  }, [bars, onSwipeRight, entryProgress]);

  const tapGesture = Gesture.Tap()
    .maxDistance(10)
    .onEnd(() => runOnJS(handleTap)());

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.18;
    })
    .onEnd((e) => {
      const flyOff = Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > 900;
      if (flyOff) {
        const dir = e.translationX > 0 ? 1 : -1;
        translateX.value = withTiming(dir * SCREEN_WIDTH * 1.6, { duration: 280 }, () => {
          entryProgress.value = 0;
          translateX.value = 0;
          translateY.value = 0;
          runOnJS(handleSwipe)(dir);
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 18 });
      }
    });

  const gesture = Gesture.Race(tapGesture, panGesture);

  // Front card: pan + rotate + entry lift animation
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value + interpolate(entryProgress.value, [0, 1], [-14, 0]) },
      { scale: interpolate(entryProgress.value, [0, 1], [0.94, 1.0]) },
      {
        rotateZ: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          [-14, 0, 14],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
    opacity: interpolate(entryProgress.value, [0, 1], [0, 1]),
    zIndex: 3,
  }));

  // Middle card: static position, no animation during drag
  const middleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 0.94 },
      { translateY: -14 },
    ],
    opacity: 0.65,
    zIndex: 2,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 0.88 },
      { translateY: -28 },
    ],
    opacity: 0.15,
    zIndex: 1,
  }));

  // Dim overlays: fade out as front card is dragged away
  const middleDimStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    return { opacity: interpolate(p, [0, 1], [1, 0]) };
  });

  const backDimStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    return { opacity: interpolate(p, [0, 1], [1, 0.55]) };
  });

  // SAVE / SKIP overlays on front card
  const saveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));
  const skipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, -20], [1, 0], Extrapolation.CLAMP),
  }));

  if (currentIndex >= bars.length) {
    return (
      <View style={styles.doneContainer}>
        <Ionicons name="checkmark-circle-outline" size={52} color={colors.neonYellow} style={{ marginBottom: 16 }} />
        <Text style={styles.doneTitle}>You've seen all {bars.length} spots</Text>
        <Text style={styles.doneSubtitle}>Search a new city to find more</Text>
        <NeonButton
          title="Start Over"
          onPress={() => setCurrentIndex(0)}
          style={{ marginTop: 20, width: 160 }}
        />
      </View>
    );
  }

  const frontBar = bars[currentIndex];
  const middleBar = bars[currentIndex + 1];
  const backBar = bars[currentIndex + 2];

  return (
    <View style={styles.deckOuter}>
      {/* Counter */}
      <Text style={styles.counter}>{currentIndex + 1} / {bars.length} spots</Text>

      {/* Stack */}
      <View style={styles.stack}>
        {backBar && <BarSwipeCard bar={backBar} savedBarIds={savedBarIds} animatedStyle={backStyle} dimOverlayStyle={backDimStyle} />}
        {middleBar && <BarSwipeCard bar={middleBar} savedBarIds={savedBarIds} animatedStyle={middleStyle} dimOverlayStyle={middleDimStyle} />}

        <GestureDetector gesture={gesture}>
          <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 3 }]}>
            <BarSwipeCard bar={frontBar} savedBarIds={savedBarIds} animatedStyle={frontStyle} />
            <Animated.View style={[styles.saveOverlay, saveStyle]} pointerEvents="none">
              <Text style={styles.saveText}>SAVE</Text>
            </Animated.View>
            <Animated.View style={[styles.skipOverlay, skipStyle]} pointerEvents="none">
              <Text style={styles.skipText}>SKIP</Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <Text style={styles.swipeHint}>← Skip  ·  Swipe right to save →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  deckOuter: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
  },
  counter: {
    ...typography.caption,
    color: colors.muted,
    marginBottom: 12,
  },
  stack: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: colors.surface,
    shadowColor: colors.neonYellow,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    padding: 22,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  catText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.3)",
    backgroundColor: "rgba(255, 184, 92, 0.1)",
  },
  savedBadgeText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.neonYellow,
    fontWeight: "700",
  },
  cardMain: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
  },
  barName: {
    ...typography.screenTitle,
    fontSize: 30,
    lineHeight: 36,
    color: colors.white,
  },
  barLocation: {
    ...typography.body,
    color: colors.muted,
    fontSize: 14,
  },
  barVibe: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 13,
  },
  cardFooter: {
    gap: 10,
  },
  footerDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tapHint: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 13,
  },
  cardDimOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    overflow: "hidden",
  },
  cardDimBg: {
    backgroundColor: "rgba(5, 1, 10, 0.55)",
  },
  // SAVE overlay (drag right — top-left of card)
  saveOverlay: {
    position: "absolute",
    top: 28,
    left: 22,
    borderWidth: 2,
    borderColor: colors.neonYellow,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    transform: [{ rotate: "-10deg" }],
  },
  saveText: {
    ...typography.caption,
    color: colors.neonYellow,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  // SKIP overlay (drag left — top-right of card)
  skipOverlay: {
    position: "absolute",
    top: 28,
    right: 22,
    borderWidth: 2,
    borderColor: colors.muted,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    transform: [{ rotate: "10deg" }],
  },
  skipText: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  swipeHint: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 12,
    marginTop: 18,
    opacity: 0.7,
  },
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  doneTitle: {
    ...typography.subheading,
    marginBottom: 8,
  },
  doneSubtitle: {
    ...typography.caption,
    textAlign: "center",
    color: colors.muted,
  },
});
