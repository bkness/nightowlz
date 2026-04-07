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
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients, surfaces } from "../../theme";
import themeColors from "../../theme/colors";
import typography from "../../theme/typography";
import BarCard from "../../components/bars/BarCard";
import Header from "../../components/layout/Header";
import SlidingPanel from "../../components/common/SlidingPanel";
import { api } from "../../utils/api";

const SEARCH_MODE_OPTIONS = [
  { id: "bars", label: "Bars" },
  { id: "clubs", label: "Clubs" },
  { id: "live_music", label: "Live Music" },
  { id: "entertainment", label: "Entertainment" },
];

function formatDistance(distanceMeters) {
  if (typeof distanceMeters !== "number") return "";
  if (distanceMeters < 1000) return `${distanceMeters} m away`;
  const miles = distanceMeters / 1609.34;
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi away`;
}

function formatSourceLabel(source) {
  if (source === "apple-maps") return "Apple Maps";
  if (source === "openstreetmap-overpass") return "Fallback Result";
  return "";
}

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [bars, setBars] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchModes, setSearchModes] = useState(["bars", "clubs", "live_music", "entertainment"]);
  const [resultSource, setResultSource] = useState("");
  const searchTimeout = useRef(null);
  const latestSearchTextRef = useRef("");
  const glowAnimation = useRef(new RNAnimated.Value(0)).current;

  const runSearch = async (query, modes) => {
    if (query.trim().length < 2) {
      setBars([]);
      setResultSource("");
      return;
    }

    setSearching(true);
    try {
      const { data } = await api.get("/maps/places", {
        params: { q: query.trim(), modes: modes.join(",") },
      });
      setBars(data.bars || []);
      setResultSource(data.source || "");
    } catch (err) {
      console.error("Discover search error:", err?.response?.data || err?.message || err);
      setBars([]);
      setResultSource("");
    } finally {
      setSearching(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    RNAnimated.timing(glowAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    RNAnimated.timing(glowAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    latestSearchTextRef.current = text;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (text.trim().length < 2) {
      setBars([]);
      setResultSource("");
      return;
    }
    searchTimeout.current = setTimeout(() => {
      runSearch(text, searchModes);
    }, 600);
  };

  const toggleMode = (modeId) => {
    setSearchModes((currentModes) => {
      const nextModes = currentModes.includes(modeId)
        ? currentModes.filter((mode) => mode !== modeId)
        : [...currentModes, modeId];

      if (nextModes.length === 0) {
        return currentModes;
      }

      return nextModes;
    });
  };

  useEffect(() => {
    if (latestSearchTextRef.current.trim().length >= 2) {
      runSearch(latestSearchTextRef.current, searchModes);
    }
  }, [searchModes]);

  return (
    <NeonScreen gradient={gradients.discover}>
      <Header compact />
      {/* CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        {/* Search + Map toggle row */}
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

        <View style={styles.chipRow}>
          {SEARCH_MODE_OPTIONS.map((option) => {
            const isActive = searchModes.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.85}
                onPress={() => toggleMode(option.id)}
                style={[styles.modeChip, isActive ? styles.modeChipActive : styles.modeChipInactive]}
              >
                <Text style={[styles.modeChipText, isActive ? styles.modeChipTextActive : styles.modeChipTextInactive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {searching ? (
          <ActivityIndicator color={themeColors.neonYellow} style={{ marginTop: 40 }} />
        ) : (
          <>
            {bars.length > 0 && (
              <Text style={styles.sectionLabel}>
                {bars.length} spots found{resultSource === "apple-maps" ? " via Apple Maps" : resultSource === "openstreetmap-overpass" ? " via OpenStreetMap fallback" : ""}
              </Text>
            )}
            {bars.length > 0 ? (
              bars.map((bar) => (
                <BarCard
                  key={bar.barId}
                  name={bar.name}
                  vibe={bar.openingHours || bar.vibe || bar.category || ""}
                  neighborhood={bar.neighborhood || ""}
                  distance={formatDistance(bar.distanceMeters)}
                  category={bar.category}
                  sourceLabel={formatSourceLabel(bar.source)}
                  onPress={() =>
                    navigation.navigate("BarProfile", {
                      bar: {
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
                      },
                    })
                  }
                />
              ))
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
          </>
        )}
      </ScrollView>
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
  sectionLabel: {
    ...typography.label,
    textAlign: "left",
    marginLeft: 12,
    marginBottom: 14,
    color: themeColors.neonBlue,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 10,
  },
  modeChip: {
    width: "48%",
    minHeight: 44,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modeChipActive: {
    backgroundColor: themeColors.neonYellow,
    borderColor: themeColors.neonYellow,
  },
  modeChipInactive: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: themeColors.muted,
  },
  modeChipText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  modeChipTextActive: {
    color: themeColors.black,
  },
  modeChipTextInactive: {
    color: themeColors.white,
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
