import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Animated as RNAnimated,
  TouchableOpacity,
} from "react-native";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients, surfaces } from "../../theme";
import themeColors from "../../theme/colors";
import typography from "../../theme/typography";
import BarCard from "../../components/bars/BarCard";
import Header from "../../components/layout/Header";
import SlidingPanel from "../../components/common/SlidingPanel";

const BARS = [
  {
    id: 1,
    name: "Chaparral Bar",
    vibe: "DJ Night Tonight",
    neighborhood: "Main Street",
  },
  {
    id: 2,
    name: "Main Stage",
    vibe: "Live Music - Friday 9PM",
    neighborhood: "Main Street",
  },
  {
    id: 3,
    name: "Kactus Kates",
    vibe: "Free JukeBox Night",
    neighborhood: "Riverfront District",
  },
];

export default function DiscoverScreen() {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
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

  const shadowRadius = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 20],
  });

  const filteredBars = BARS.filter(
    (bar) =>
      bar.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bar.neighborhood.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <NeonScreen gradient={gradients.discover}>
      {/* CONTENT */}
      <ScrollView
        style={{ paddingHorizontal: 10 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 24 }}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
      >
        <Header compact />
        {/* Search Input */}
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
                shadowRadius,
                borderColor: isFocused
                  ? themeColors.neonYellow
                  : themeColors.muted,
                borderWidth: isFocused ? 1.5 : 1,
              },
            ]}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search by city..."
              placeholderTextColor={themeColors.muted}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              keyboardType="default"
              returnKeyType="done"
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
        {/* Bar Cards */}
        {filteredBars.length > 0 ? (
          filteredBars.map((bar) => (
            <BarCard
              key={bar.id}
              name={bar.name}
              vibe={bar.vibe}
              neighborhood={bar.neighborhood}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="search"
              size={48}
              color={themeColors.muted}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>No Bars Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching by a different city
            </Text>
          </View>
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
  logo: {
    alignItems: "center",
    marginTop: 40,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    marginLeft: 12,
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
