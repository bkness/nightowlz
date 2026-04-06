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
import { useRef, useState } from "react";
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

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [bars, setBars] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);
  const glowAnimation = useRef(new RNAnimated.Value(0)).current;

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
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (text.trim().length < 2) {
      setBars([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get("/maps/nightlife", { params: { q: text.trim() } });
        setBars(data.bars || []);
      } catch (err) {
        console.error("Discover search error:", err?.response?.data || err?.message || err);
        setBars([]);
      } finally {
        setSearching(false);
      }
    }, 600);
  };

  return (
    <NeonScreen gradient={gradients.discover}>
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
        <Header compact />
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

        {searching ? (
          <ActivityIndicator color={themeColors.neonYellow} style={{ marginTop: 40 }} />
        ) : (
          <>
            {bars.length > 0 && (
              <Text style={styles.sectionLabel}>{bars.length} bars found</Text>
            )}
            {bars.length > 0 ? (
              bars.map((bar) => (
                <BarCard
                  key={bar.barId}
                  name={bar.name}
                  vibe={bar.openingHours || bar.vibe || bar.category || ""}
                  neighborhood={bar.neighborhood || ""}
                  category={bar.category}
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
          Starter panel for sort and filter controls.
        </Text>
        <Text style={styles.panelText}>
          Add city, vibe, distance, or price chips here.
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
    paddingTop: 0,
    paddingBottom: 28,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
