import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, ScrollView, View, Text } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients } from "../../theme";
import { useTheme } from "../../theme/ThemeProvider";
import colors from "../../theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import typography from "../../theme/typography";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import EmptyStateCard from "../../components/common/EmptyStateCard";
import BarCard from "../../components/bars/BarCard";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function MyBarsScreen() {
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const userId = user?.id || user?._id || null;
  const theme = useTheme();
  const themeColors = theme?.colors || colors;
  const [savedBars, setSavedBars] = useState([]);
  const [loading, setLoading] = useState(false);
  const latestSavedBar = savedBars[0] || null;

  const loadSavedBars = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/saved-bars", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: token ? undefined : userId ? { userId } : {},
      });
      setSavedBars(data.bars || []);
    } catch (error) {
      console.log("Failed to load saved bars", error?.message);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  const removeSavedBar = useCallback(async (barId) => {
    try {
      const { data } = await api.delete(`/saved-bars/${barId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setSavedBars(data.bars || []);
    } catch (error) {
      console.log("Failed to remove saved bar", error?.message);
    }
  }, [token]);

  useEffect(() => {
    loadSavedBars();
  }, [loadSavedBars]);

  useFocusEffect(
    useCallback(() => {
      loadSavedBars();
    }, [loadSavedBars]),
  );

  return (
    <NeonScreen gradient={gradients.myBars}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <ScreenTitleBlock
          title="My Bars"
          subtitle="Your Saved Favorites"
          colors={themeColors}
          style={styles.headerContainer}
        />
        {!loading && savedBars.length > 0 && (
          <View style={styles.collectionCard}>
            <Text style={styles.collectionEyebrow}>Collection</Text>
            <Text style={styles.collectionTitle}>{savedBars.length} saved spots</Text>
            <Text style={styles.collectionSubtitle}>
              {latestSavedBar
                ? `Latest add: ${latestSavedBar.name}`
                : "Build a shortlist of bars worth revisiting."}
            </Text>

            <View style={styles.collectionChipRow}>
              <View style={styles.collectionChip}>
                <Text style={[styles.collectionChipText, { color: themeColors.neonYellow }]}>Personal shortlist</Text>
              </View>
              <View style={styles.collectionChipBlue}>
                <Text style={[styles.collectionChipTextBlue, { color: themeColors.neonBlue }]}>Tap heart to remove</Text>
              </View>
            </View>
          </View>
        )}
        {loading && (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={themeColors.neonYellow} />
          </View>
        )}
        {!loading && savedBars.length > 0 && (
          <View>
            {savedBars.map((bar) => (
              <BarCard
                key={bar.barId}
                name={bar.name}
                vibe={bar.vibe}
                neighborhood={bar.neighborhood}
                category={bar.category}
                isSaved
                showSaveAction
                onToggleSave={() => removeSavedBar(bar.barId)}
                onPress={() =>
                  navigation.navigate("BarProfile", {
                    bar: {
                      barId: bar.barId,
                      name: bar.name,
                      neighborhood: bar.neighborhood,
                      vibe: bar.vibe,
                      category: bar.category,
                      openingHours: bar.openingHours || "",
                      lat: bar.lat,
                      lon: bar.lon,
                      source: bar.source,
                    },
                  })
                }
              />
            ))}
          </View>
        )}
        {!loading && savedBars.length === 0 && (
          <EmptyStateCard
            title="No bars saved yet!"
            subtitle="Tap the star on a bar to add it here."
            titleStyle={[typography.heading, { color: themeColors.white }]}
            subtitleStyle={[styles.subtitle, { color: themeColors.muted }]}
            cardStyle={[
              styles.emptyCard,
              {
                borderColor: themeColors.neonYellow,
              },
            ]}
            icon={
              <MaterialCommunityIcons
                name="star-outline"
                size={48}
                color={themeColors.neonYellow}
                style={styles.icon}
              />
            }
          >
            <NeonButton
              title="Explore Bars"
              onPress={() => navigation.navigate("Discover")}
              style={styles.ctaButton}
            />
          </EmptyStateCard>
        )}
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  loaderWrap: {
    paddingVertical: 20,
  },
  collectionCard: {
    marginBottom: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.26)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  collectionEyebrow: {
    ...typography.caption,
    color: colors.neonYellow,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  collectionTitle: {
    ...typography.subheading,
    fontSize: 24,
    lineHeight: 30,
  },
  collectionSubtitle: {
    ...typography.body,
    color: colors.muted,
    marginTop: 6,
    lineHeight: 22,
  },
  collectionChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  collectionChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.25)",
    backgroundColor: "rgba(255, 184, 92, 0.12)",
  },
  collectionChipBlue: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.24)",
    backgroundColor: "rgba(123, 223, 255, 0.1)",
  },
  collectionChipText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: "700",
  },
  collectionChipTextBlue: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    alignSelf: "center",
    marginTop: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 28,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  icon: {
    marginBottom: 16,
    textShadowColor: colors.glowYellow,
    textShadowRadius: 12,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  ctaButton: {
    alignSelf: "stretch",
  },
});
