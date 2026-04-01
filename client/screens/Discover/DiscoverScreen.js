import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Animated as RNAnimated,
} from "react-native";
import { useState } from "react";
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
  const glowAnimation = new RNAnimated.Value(0);

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
        style={{ paddingHorizontal: 20, marginTop: 12 }}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
      >
        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={18}
            color={isFocused ? colors.neonYellow : colors.muted}
            style={styles.searchIcon}
          />
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
            <TextInput
              style={styles.searchInput}
              placeholder="Search by city..."
              placeholderTextColor={colors.muted}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              keyboardType="default"
              returnKeyType="done"
            />
          </RNAnimated.View>
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
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(13, 2, 23, 0.6)",
    borderColor: colors.muted,
    shadowColor: colors.neonYellow,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.white,
    fontSize: 16,
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
