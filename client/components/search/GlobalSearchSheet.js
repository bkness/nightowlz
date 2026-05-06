import { forwardRef, useCallback, useRef } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BarCard from "../bars/BarCard";
import useBarSearch, { SEARCH_MODE_OPTIONS } from "../../hooks/useBarSearch";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import surfaces from "../../theme/surfaces";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlobalSearchSheet = forwardRef(function GlobalSearchSheet(_props, ref) {
  const navigation = useNavigation();
  const inputRef = useRef(null);

  const {
    searchText,
    bars,
    searching,
    searchModes,
    savedBarIds,
    visibleCount,
    setVisibleCount,
    handleSearch,
    toggleMode,
    loadSavedBars,
  } = useBarSearch();

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.65}
      />
    ),
    []
  );

  const handleSheetChange = useCallback(
    (index) => {
      if (index === 0) {
        loadSavedBars();
        setTimeout(() => inputRef.current?.focus(), 200);
      }
    },
    [loadSavedBars]
  );

  const handleBarPress = useCallback(
    (bar) => {
      ref?.current?.close();
      navigation.navigate("BarProfile", {
        isSaved: savedBarIds.has(String(bar.barId)),
        bar,
      });
    },
    [navigation, ref, savedBarIds]
  );

  function formatDistance(distanceMeters) {
    if (typeof distanceMeters !== "number") return "";
    if (distanceMeters < 1000) return `${distanceMeters} m away`;
    const miles = distanceMeters / 1609.34;
    return `${miles.toFixed(miles < 10 ? 1 : 0)} mi away`;
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["92%"]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      style={styles.sheet}
    >
      {/* Search input */}
      <View style={styles.inputRow}>
        <Ionicons name="search" size={18} color={colors.muted} style={styles.searchIcon} />
        <BottomSheetTextInput
          ref={inputRef}
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search by city..."
          placeholderTextColor={colors.muted}
          style={styles.textInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Flex accordion mode chips */}
      <View style={styles.chipRow}>
        {SEARCH_MODE_OPTIONS.map((option) => {
          const isActive = searchModes.includes(option.id);
          return (
            <AnimatedPressable
              key={option.id}
              onPress={() => toggleMode(option.id)}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
                {
                  flexGrow: isActive ? 3 : 1,
                  transitionProperty: "flexGrow",
                  transitionDuration: 300,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}
              >
                {option.label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      {/* Results */}
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {searching ? (
          <ActivityIndicator color={colors.neonYellow} style={{ marginTop: 32 }} />
        ) : bars.length > 0 ? (
          <>
            <Text style={styles.resultsLabel}>{bars.length} spots found</Text>
            {bars.slice(0, visibleCount).map((bar) => (
              <BarCard
                key={bar.barId}
                name={bar.name}
                vibe={bar.openingHours || bar.vibe || bar.category || ""}
                neighborhood={bar.neighborhood || ""}
                distance={formatDistance(bar.distanceMeters)}
                category={bar.category}
                onPress={() =>
                  handleBarPress({
                    barId: String(bar.barId),
                    name: bar.name,
                    neighborhood: bar.neighborhood || "",
                    vibe: bar.vibe || bar.category || "",
                    category: bar.category,
                    openingHours: bar.openingHours || "",
                    phone: bar.phone || "",
                    website: bar.website || "",
                    addressLines: bar.addressLines || [],
                    locality: bar.locality || "",
                    state: bar.state || "",
                    distanceMeters: bar.distanceMeters ?? null,
                    lat: bar.lat,
                    lon: bar.lon,
                    source: bar.source,
                  })
                }
              />
            ))}
            {bars.length > visibleCount && (
              <TouchableOpacity
                onPress={() => setVisibleCount((c) => c + 20)}
                style={styles.showMore}
              >
                <Text style={styles.showMoreText}>
                  Show More ({bars.length - visibleCount} remaining)
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : searchText.length >= 2 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={40} color={colors.muted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No Bars Found</Text>
            <Text style={styles.emptySubtitle}>Try a different city or neighborhood</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={40} color={colors.muted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Search a City</Text>
            <Text style={styles.emptySubtitle}>Type a city name to find bars near you</Text>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default GlobalSearchSheet;

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
  },
  sheetBackground: {
    ...surfaces.sheetBackground,
  },
  handleIndicator: {
    backgroundColor: colors.neonYellow,
    width: 48,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingVertical: 0,
  },
  chipRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  chip: {
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  chipActive: {
    backgroundColor: colors.neonYellow,
    borderColor: colors.neonYellow,
  },
  chipInactive: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.muted,
  },
  chipText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  chipTextActive: {
    color: colors.background,
  },
  chipTextInactive: {
    color: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  resultsLabel: {
    ...typography.label,
    color: colors.neonBlue,
    marginBottom: 12,
    marginLeft: 4,
  },
  showMore: {
    alignItems: "center",
    paddingVertical: 16,
  },
  showMoreText: {
    color: colors.neonYellow,
    fontSize: 15,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    ...typography.subheading,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.caption,
    textAlign: "center",
  },
});
