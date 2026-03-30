import { View, Text, StyleSheet, ScrollView } from "react-native";
import { gradients } from "../../theme";
import NeonScreen from "../../components/common/NeonScreen";
import typography from "../../theme/typography";
import colors from "../../theme/colors";

export default function EventsScreen() {
  return (
    <NeonScreen gradient={gradients.events}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text
            style={[
              typography.logo,
              styles.title,
              {
                color: colors.neonYellow,
                textShadowColor: colors.glowYellow,
                textShadowRadius: 12,
                textShadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            Events
          </Text>
          <Text
            style={[
              typography.tagline,
              styles.subtitle,
              {
                color: colors.neonBlue,
                textShadowColor: colors.glowBlue,
                textShadowRadius: 12,
                textShadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            Live music, karaoke, trivia & more
          </Text>
        </View>
        {/* Add event cards or content here */}
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 0,
  },
});
