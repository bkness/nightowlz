import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import { useTheme } from "../../hooks";
import colors from "../../theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import typography from "../../theme/typography";
import BarCard from "../../components/bars/BarCard";

export default function MyBarsScreen() {
  const [savedBars, setSavedBars] = useState([]);

  // Reload saved bars when screen is focused
  useFocusEffect(
    (() => {
      const loadSavedBars = async () => {
        try {
          const saved = await AsyncStorage.getItem("savedBars");
          if (saved) {
            setSavedBars(JSON.parse(saved));
          } else {
            setSavedBars([]);
          }
        } catch (err) {
          setSavedBars([]);
        }
      };
      loadSavedBars();
      return () => {};
    })(),
  );

  // Use theme context if available, otherwise fallback to static colors
  let themeColors = colors;
  try {
    themeColors = useTheme().colors || colors;
  } catch {}

  return (
    <NeonScreen gradient={gradients.myBars}>
      <View style={styles.headerContainer}>
        <Text style={[typography.screenTitle, styles.title]}>My Bars</Text>
        <Text style={[typography.screenSubtitle, styles.subtitle]}>
          Your Saved Favorites
        </Text>
      </View>

      {savedBars.length === 0 ? (
        <View
          style={[styles.emptyCard, { borderColor: themeColors.neonOrange }]}
        >
          <MaterialCommunityIcons
            name="star-outline"
            size={40}
            color={themeColors.neonOrange}
            style={{
              marginBottom: 8,
              textShadowColor: themeColors.glowOrange,
              textShadowRadius: 12,
            }}
          />
          <Text
            style={[
              typography.heading,
              { color: themeColors.textPrimary, textAlign: "center" },
            ]}
          >
            No bars saved yet!
          </Text>
          <Text
            style={[
              typography.bodyMuted,
              { textAlign: "center", marginTop: 4 },
            ]}
          >
            Tap the star on a bar to add it here.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.savedList}>
            {savedBars.map((bar) => (
              <BarCard
                key={bar.id}
                name={bar.name}
                vibe={bar.vibe}
                neighborhood={bar.neighborhood}
                address={bar.address}
                popular={bar.popular}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    ...typography.screenHeaderContainer,
    marginTop: 18,
    marginBottom: 22,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 0,
  },
  emptyCard: {
    alignSelf: "center",
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 28,
    width: "90%",
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  savedList: {
    gap: 10,
  },
});
