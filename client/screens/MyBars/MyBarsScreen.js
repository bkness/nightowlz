import { View, Text, StyleSheet } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import { useTheme } from "../../theme/ThemeProvider";
import colors from "../../theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import typography from "../../theme/typography";

export default function MyBarsScreen() {
  // Use theme context if available, otherwise fallback to static colors
  let themeColors = colors;
  try { themeColors = useTheme().colors || colors; } catch {}
  // For now, always empty. Replace with your saved bars logic.
  const savedBars = [];

  return (
    <NeonScreen gradient={gradients.myBars}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            typography.logo,
            styles.title,
            {
              color: themeColors.neonYellow,
              textShadowColor: themeColors.glowYellow,
              textShadowRadius: 24,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          My Bars
        </Text>
        <Text
          style={[
            typography.tagline,
            styles.subtitle,
            {
              color: themeColors.neonBlue,
              textShadowColor: themeColors.glowBlue,
              textShadowRadius: 12,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          Your Saved Favorites
        </Text>
      </View>
      {savedBars.length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: "rgba(0,0,0,0.25)", borderColor: themeColors.neonYellow }]}> 
          <MaterialCommunityIcons name="star-outline" size={40} color={themeColors.neonYellow} style={{ marginBottom: 8, textShadowColor: themeColors.glowYellow, textShadowRadius: 16 }} />
          <Text style={[typography.heading, { color: themeColors.white, textAlign: "center" }]}>No bars saved yet!</Text>
          <Text style={[typography.body, { color: themeColors.muted, textAlign: "center", marginTop: 4 }]}>Tap the star on a bar to add it here.</Text>
        </View>
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
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
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
});
