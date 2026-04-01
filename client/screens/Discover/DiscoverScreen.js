import { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gradients, typography, colors } from "../../theme";
import BarCard from "../../components/bars/BarCard";
import Header from "../../components/layout/Header";
import { NeonScreen } from "../../components/common";
import API_BASE_URL from "../../utils/apiBaseUrl";

const DISCOVER_BARS = [
  {
    id: "1",
    name: "Chaparral Bar",
    vibe: "DJ Night Tonight",
    neighborhood: "Main Street",
    address: "412 Main Street, Cottonwood, AZ",
    phone: "(555) 010-2101",
    popular: true,
  },
  {
    id: "2",
    name: "Main Stage",
    vibe: "Live Music - Friday 9PM",
    neighborhood: "Main Street",
    address: "19 South Birch Ave, Cottonwood, AZ",
    phone: "(555) 010-9442",
    popular: true,
  },
  {
    id: "3",
    name: "Kactus Kates",
    vibe: "Free Jukebox Night",
    neighborhood: "Riverfront District",
    address: "88 Riverfront Dr, Cottonwood, AZ",
    phone: "(555) 010-5540",
    popular: false,
  },
  {
    id: "4",
    name: "Canyon Taproom",
    vibe: "Trivia Thursday 8PM",
    neighborhood: "Old Town",
    address: "230 Oak Street, Cottonwood, AZ",
    phone: "(555) 010-7748",
    popular: false,
  },
];

export default function DiscoverScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [bars, setBars] = useState(DISCOVER_BARS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mapBackendBarToCard = (bar, index) => {
    const city = bar?.address?.city || "Unknown area";
    const state = bar?.address?.state || "";
    const neighborhood = [city, state].filter(Boolean).join(", ");

    return {
      id: `${bar.osmType || "node"}-${bar.osmId || index}`,
      name: bar.name || "Unnamed Bar",
      vibe: bar.category ? `${bar.category} spot nearby` : "Popular nearby",
      neighborhood,
      address: bar?.address?.full || neighborhood,
      phone: bar.phone || "",
      popular: index < 3,
      events: [],
    };
  };

  const handleSearch = async () => {
    const trimmed = query.trim();
    setError("");

    if (!trimmed) {
      setBars(DISCOVER_BARS);
      return;
    }

    try {
      setLoading(true);

      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
      const geoRes = await axios.get(geoUrl, {
        headers: {
          Accept: "application/json",
        },
        timeout: 12000,
      });

      const first = geoRes.data?.[0];
      if (!first?.lat || !first?.lon) {
        setBars([]);
        setError("No location match found. Try a city or neighborhood.");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/bars/search`, {
        params: {
          lat: Number(first.lat),
          lon: Number(first.lon),
          radius: 12000,
        },
        timeout: 15000,
      });

      const nextBars = (res.data?.bars || []).map(mapBackendBarToCard);
      setBars(nextBars);
      if (!nextBars.length) {
        setError("No bars found in that area yet.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Search failed. Check server connection and try again.";
      setBars([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeonScreen gradient={gradients.discover}>
      <Header />

      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search city, neighborhood, or area"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="words"
            onSubmitEditing={handleSearch}
          />
          <Pressable style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons name="search" size={16} color={colors.neonOrange} />
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tonight Picks</Text>
      <ScrollView
        style={styles.cardsScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.neonOrange} />
            <Text style={styles.loadingText}>Searching nearby bars...</Text>
          </View>
        ) : null}
        {!loading && error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {!loading &&
          bars.map((bar) => (
            <BarCard
              key={bar.id}
              name={bar.name}
              vibe={bar.vibe}
              neighborhood={bar.neighborhood}
              address={bar.address}
              popular={bar.popular}
              onPress={() => navigation.navigate("BarProfile", { bar })}
            />
          ))}
        {!loading && bars.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try a different city or area, like Phoenix or Scottsdale.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    backgroundColor: colors.cardSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    ...typography.body,
    color: colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 147, 46, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  errorWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 147, 46, 0.35)",
    backgroundColor: "rgba(255, 147, 46, 0.12)",
    padding: 10,
    marginBottom: 12,
    alignSelf: "stretch",
  },
  errorText: {
    ...typography.caption,
    color: colors.neonYellow,
    flexWrap: "wrap",
    lineHeight: 18,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.secondaryPurple,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  cardsScroll: {
    paddingHorizontal: 2,
  },
  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    padding: 14,
    marginBottom: 20,
    alignSelf: "stretch",
    minHeight: 0,
  },
  emptyTitle: {
    ...typography.caption,
    color: colors.neonOrange,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  emptyText: {
    ...typography.bodyMuted,
    lineHeight: 18,
    flexWrap: "wrap",
    flexShrink: 1,
    width: "100%",
  },
});
