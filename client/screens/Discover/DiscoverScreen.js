import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Animated as RNAnimated,
} from "react-native";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import BarCard from "../../components/bars/BarCard";
import Header from "../../components/layout/Header";

const BARS = [
  {
    id: 1,
    name: "Chaparral Bar",
    vibe: "DJ Night Tonight",
    neighborhood: "Main Street",
    distance: "0.8 mi",
    category: "Neon Lounge",
    icon: "owl",
  },
  {
    id: 2,
    name: "Main Stage",
    vibe: "Live Music - Friday 9PM",
    neighborhood: "Main Street",
    distance: "1.2 mi",
    category: "Live Music",
    icon: "music-clef-treble",
  },
  {
    id: 3,
    name: "Kactus Kates",
    vibe: "Free JukeBox Night",
    neighborhood: "Riverfront District",
    distance: "2.4 mi",
    category: "Late Night",
    icon: "cactus",
  },
];

export default function DiscoverScreen() {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
      <Header />
      {/* CONTENT */}
      <ScrollView
        style={{ paddingHorizontal: 16, marginTop: 18 }}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
      >
        {/* Search Input */}
        <RNAnimated.View
          style={[
            styles.inputContainer,
            {
              shadowRadius,
              borderColor: isFocused ? colors.neonYellow : colors.muted,
              borderWidth: isFocused ? 1.5 : 1,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={isFocused ? colors.neonYellow : colors.navInactive}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city..."
            placeholderTextColor={colors.navInactive}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType="default"
            returnKeyType="done"
          />
        </RNAnimated.View>

        {/* Bar Cards */}
        {filteredBars.length > 0 ? (
          filteredBars.map((bar) => (
            <BarCard
              key={bar.id}
              name={bar.name}
              vibe={bar.vibe}
              neighborhood={bar.neighborhood}
              distance={bar.distance}
              category={bar.category}
              icon={bar.icon}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="search"
              size={48}
              color={colors.muted}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>No Bars Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching by a different city
            </Text>
          </View>
        )}
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  searchIcon: {
    marginLeft: 14,
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(13, 2, 23, 0.62)",
    borderColor: colors.muted,
    shadowColor: colors.neonYellow,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 0 },
    marginTop: 50,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingRight: 14,
    color: colors.white,
    fontSize: 18,
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
