import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Animated as RNAnimated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import NeonScreen from "../../components/common/NeonScreen";
import SlidingPanel from "../../components/common/SlidingPanel";
import { gradients, surfaces } from "../../theme";
import themeColors from "../../theme/colors";
import typography from "../../theme/typography";
import SwipeCardDeck from "../../components/bars/SwipeCardDeck";
import FilterChips from "../../components/bars/FilterChips";
import Header from "../../components/layout/Header";
import useBarSearch, { SEARCH_MODE_OPTIONS } from "../../hooks/useBarSearch";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const glowAnimation = useRef(new RNAnimated.Value(0)).current;

  const {
    searchText,
    bars,
    searching,
    searchModes,
    savedBarIds,
    handleSearch,
    toggleMode,
    loadSavedBars,
  } = useBarSearch();

  useFocusEffect(
    useCallback(() => {
      loadSavedBars();
    }, [loadSavedBars])
  );

  const handleFocus = () => {
    setIsFocused(true);
    RNAnimated.timing(glowAnimation, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    RNAnimated.timing(glowAnimation, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const handleCardPress = useCallback((bar) => {
    navigation.navigate("BarProfile", {
      isSaved: savedBarIds.has(String(bar.barId)),
      bar,
    });
  }, [navigation, savedBarIds]);

  const handleDeckSave = useCallback(async (bar) => {
    if (!token) return;
    try {
      await api.post(
        "/saved-bars",
        {
          barId: bar.barId,
          name: bar.name,
          vibe: bar.vibe || "",
          neighborhood: bar.neighborhood || "",
          category: bar.category || "",
          openingHours: bar.openingHours || "",
          lat: bar.lat ?? null,
          lon: bar.lon ?? null,
          source: bar.source || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadSavedBars();
    } catch (err) {
      console.log("Deck save failed", err?.message);
    }
  }, [token, loadSavedBars]);

  const showDeck = bars.length > 0 && !searching;

  const SearchBar = (
    <View style={styles.searchWrapper}>
      <Ionicons
        name="search"
        size={18}
        color={isFocused ? themeColors.neonYellow : themeColors.muted}
        style={styles.searchIcon}
      />
      <RNAnimated.View
        style={[
          styles.inputContainer,
          {
            shadowRadius: glowAnimation.interpolate({ inputRange: [0, 1], outputRange: [12, 20] }),
            borderColor: isFocused ? themeColors.neonYellow : themeColors.muted,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city..."
          placeholderTextColor={themeColors.muted}
          value={searchText}
          onChangeText={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="default"
          returnKeyType="search"
        />
      </RNAnimated.View>
      <TouchableOpacity
        onPress={() => setIsFilterPanelVisible(true)}
        style={styles.filterButton}
        activeOpacity={0.85}
      >
        <Ionicons name="options" size={18} color={themeColors.neonYellow} />
      </TouchableOpacity>
    </View>
  );

  const ModeChips = (
    <FilterChips
      options={SEARCH_MODE_OPTIONS}
      selected={searchModes}
      onToggle={toggleMode}
    />
  );

  return (
    <NeonScreen gradient={gradients.discover}>
      <Header compact />

      {showDeck ? (
        <View style={styles.deckLayout}>
          <View style={styles.topControls}>
            {SearchBar}
            {ModeChips}
          </View>
          <SwipeCardDeck
            bars={bars}
            savedBarIds={savedBarIds}
            onSwipeRight={handleDeckSave}
            onCardPress={handleCardPress}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          {SearchBar}
          {ModeChips}

          {searching ? (
            <ActivityIndicator color={themeColors.neonYellow} style={{ marginTop: 40 }} />
          ) : searchText.length >= 2 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={themeColors.muted} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No Bars Found</Text>
              <Text style={styles.emptySubtitle}>Try a different city or neighborhood</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={48} color={themeColors.muted} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Search a City</Text>
              <Text style={styles.emptySubtitle}>Type a city name to find bars near you</Text>
            </View>
          )}
        </ScrollView>
      )}

      <SlidingPanel
        isVisible={isFilterPanelVisible}
        onClose={() => setIsFilterPanelVisible(false)}
        title="Search Filters"
        snapPoints={["30%", "52%"]}
      >
        <Text style={styles.panelText}>
          Pick one or more search modes above to blend drinks, dancing, music, and entertainment.
        </Text>
        <Text style={styles.panelText}>
          Apple Maps runs first and Overpass fills in if Apple search is unavailable.
        </Text>
      </SlidingPanel>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  deckLayout: {
    flex: 1,
    paddingHorizontal: 12,
  },
  topControls: {
    paddingTop: 18,
  },
  scrollView: {
    paddingHorizontal: 12,
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 28,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 12,
    marginLeft: 12,
    zIndex: 10,
  },
  inputContainer: {
    ...surfaces.glassField,
    flex: 1,
    height: 44,
    shadowColor: themeColors.neonYellow,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
  },
  filterButton: {
    ...surfaces.glassField,
    marginLeft: 8,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: themeColors.white,
    fontSize: 16,
  },
  panelText: {
    ...typography.body,
    color: themeColors.white,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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
