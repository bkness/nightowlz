import { StyleSheet, ScrollView, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { gradients, surfaces, typography } from "../../theme";
import NeonScreen from "../../components/common/NeonScreen";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import colors from "../../theme/colors";

export default function EventsScreen() {
  return (
    <NeonScreen gradient={gradients.events}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenTitleBlock
          title="Events"
          subtitle="Live music, karaoke, trivia & more"
          style={styles.headerContainer}
        />
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons
            name="calendar-star"
            size={44}
            color={colors.neonYellow}
            style={styles.icon}
          />
          <Text style={styles.title}>Fresh events are on deck</Text>
          <Text style={styles.subtitle}>
            We are wiring up real-time event drops for your favorite spots.
          </Text>
        </View>
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 32,
  },
  headerContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  emptyCard: {
    ...surfaces.neonCard,
    padding: 24,
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
    textShadowColor: colors.glowYellow,
    textShadowRadius: 10,
  },
  title: {
    ...typography.subheading,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
    textAlign: "center",
  },
});
