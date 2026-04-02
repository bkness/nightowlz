import { View, Text, StyleSheet, ScrollView } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients, surfaces } from "../../theme";
import { useTheme } from "../../theme/ThemeProvider";
import colors from "../../theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import typography from "../../theme/typography";
import { useNavigation } from "@react-navigation/native";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";

export default function MyBarsScreen() {
  const navigation = useNavigation();
  // Use theme context if available, otherwise fallback to static colors
  let themeColors = colors;
  try {
    themeColors = useTheme().colors || colors;
  } catch {}
  // For now, always empty. Replace with your saved bars logic.
  const savedBars = [];

  return (
    <NeonScreen gradient={gradients.myBars}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitleBlock
          title="My Bars"
          subtitle="Your Saved Favorites"
          colors={themeColors}
          style={styles.headerContainer}
        />
        {savedBars.length === 0 && (
          <View
            style={[
              styles.emptyCard,
              {
                borderColor: themeColors.neonYellow,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="star-outline"
              size={48}
              color={themeColors.neonYellow}
              style={{
                marginBottom: 16,
                textShadowColor: themeColors.glowYellow,
                textShadowRadius: 12,
              }}
            />
            <Text
              style={[
                typography.heading,
                { color: themeColors.white, textAlign: "center" },
              ]}
            >
              No bars saved yet!
            </Text>
            <Text
              style={[
                typography.body,
                {
                  color: themeColors.muted,
                  textAlign: "center",
                  marginTop: 8,
                  marginBottom: 24,
                },
              ]}
            >
              Tap the star on a bar to add it here.
            </Text>
            <NeonButton
              title="Explore Bars"
              onPress={() => navigation.navigate("Discover")}
              style={styles.ctaButton}
            />
          </View>
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
  emptyCard: {
    ...surfaces.neonCard,
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
  ctaButton: {
    alignSelf: "stretch",
  },
});
