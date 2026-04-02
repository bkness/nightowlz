import { View, Text, StyleSheet } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients } from "../../theme";
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
              backgroundColor: "rgba(0,0,0,0.25)",
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
          />
        </View>
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 0,
  },
  emptyCard: {
    alignSelf: "center",
    marginTop: 32, // 8px * 4
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 32, // 8px * 4
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
});
