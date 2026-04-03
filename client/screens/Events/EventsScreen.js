import { StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { gradients } from "../../theme";
import NeonScreen from "../../components/common/NeonScreen";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import EmptyStateCard from "../../components/common/EmptyStateCard";
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
        <EmptyStateCard
          title="Fresh events are on deck"
          subtitle="We are wiring up real-time event drops for your favorite spots."
          cardStyle={styles.emptyCard}
          subtitleStyle={styles.subtitle}
          icon={
            <MaterialCommunityIcons
              name="calendar-star"
              size={44}
              color={colors.neonYellow}
              style={styles.icon}
            />
          }
        />
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
    marginTop: 0,
  },
  icon: {
    marginBottom: 12,
    textShadowColor: colors.glowYellow,
    textShadowRadius: 10,
  },
  subtitle: {
    color: colors.muted,
  },
});
