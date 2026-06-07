import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, ScrollView, View, Text } from "react-native";
import DraggableFlatList, { ScaleDecorator, ShadowDecorator } from "react-native-draggable-flatlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const ORDER_KEY = "mybars-order";

function applyOrder(bars, order) {
  if (!order || order.length === 0) return bars;
  const byId = new Map(bars.map((b) => [String(b.barId), b]));
  const ordered = order.flatMap((id) => (byId.has(id) ? [byId.get(id)] : []));
  const newBars = bars.filter((b) => !order.includes(String(b.barId)));
  return [...ordered, ...newBars];
}

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
      const [{ data }, orderJson] = await Promise.all([
        api.get("/saved-bars", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: token ? undefined : userId ? { userId } : {},
        }),
        AsyncStorage.getItem(ORDER_KEY),
      ]);
      const bars = data.bars || [];
      const order = orderJson ? JSON.parse(orderJson) : null;
      setSavedBars(applyOrder(bars, order));
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
      const bars = data.bars || [];
      const currentOrder = savedBars
        .map((b) => String(b.barId))
        .filter((id) => id !== String(barId));
      setSavedBars(applyOrder(bars, currentOrder));
      await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(currentOrder));
    } catch (error) {
      console.log("Failed to remove saved bar", error?.message);
    }
  }, [token, savedBars]);

  const onDragEnd = useCallback(({ data }) => {
    setSavedBars(data);
    AsyncStorage.setItem(ORDER_KEY, JSON.stringify(data.map((b) => String(b.barId))));
  }, []);

  useEffect(() => {
    loadSavedBars();
  }, [loadSavedBars]);

  useFocusEffect(
    useCallback(() => {
      loadSavedBars();
    }, [loadSavedBars]),
  );

  const renderItem = useCallback(({ item, drag }) => (
    <ShadowDecorator>
      <ScaleDecorator activeScale={0.97}>
        <BarCard
          name={item.name}
          vibe={item.vibe}
          neighborhood={item.neighborhood}
          category={item.category}
          dragHandleOnLongPress={drag}
          onDelete={() => removeSavedBar(item.barId)}
          onPress={() =>
            navigation.navigate("BarProfile", {
              isSaved: true,
              fromMyBars: true,
              bar: {
                barId: item.barId,
                name: item.name,
                neighborhood: item.neighborhood,
                vibe: item.vibe,
                category: item.category,
                openingHours: item.openingHours || "",
                lat: item.lat,
                lon: item.lon,
                source: item.source,
              },
            })
          }
        />
      </ScaleDecorator>
    </ShadowDecorator>
  ), [navigation, removeSavedBar]);

  const collectionCard = savedBars.length > 0 && (
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
      </View>
      <Text style={styles.swipeHint}>← swipe to remove  ·  hold ≡ to reorder</Text>
    </View>
  );

  const header = (
    <>
      <ScreenTitleBlock
        title="My Bars"
        subtitle="Your Saved Favorites"
        colors={themeColors}
        style={styles.headerContainer}
      />
      {collectionCard}
    </>
  );

  return (
    <NeonScreen gradient={gradients.myBars}>
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={themeColors.neonYellow} />
        </View>
      ) : savedBars.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ScreenTitleBlock
            title="My Bars"
            subtitle="Your Saved Favorites"
            colors={themeColors}
            style={styles.headerContainer}
          />
          <EmptyStateCard
            title="No bars saved yet!"
            titleStyle={[typography.heading, { color: themeColors.white }]}
            cardStyle={[styles.emptyCard, { borderColor: themeColors.neonYellow }]}
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
        </ScrollView>
      ) : (
        <DraggableFlatList
          data={savedBars}
          keyExtractor={(item) => String(item.barId)}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          ListHeaderComponent={header}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
        />
      )}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  collectionChipText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: "700",
  },
  swipeHint: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 12,
    marginTop: 10,
    opacity: 0.7,
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
  ctaButton: {
    alignSelf: "stretch",
  },
});
