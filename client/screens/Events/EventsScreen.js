import { StyleSheet, ScrollView } from "react-native";
import { gradients } from "../../theme";
import NeonScreen from "../../components/common/NeonScreen";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";

export default function EventsScreen() {
  return (
    <NeonScreen gradient={gradients.events}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenTitleBlock
          title="Events"
          subtitle="Live music, karaoke, trivia & more"
          style={styles.headerContainer}
        />
        {/* Add event cards or content here */}
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
    marginBottom: 32,
  },
});
