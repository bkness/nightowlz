import { View, Text, StyleSheet, ScrollView } from "react-native";
import { gradients } from "../../theme";
import NeonScreen from "../../components/common/NeonScreen";
import typography from "../../theme/typography";
import EventCard from "../../components/bars/EventCard";

const EVENTS = [
  {
    title: "Live Band at Belfry Brewery",
    when: "Thu · 8:00 PM",
    venue: "Belfry Brewery",
  },
  {
    title: "Trivia Night at The Tipsy Cactus",
    when: "Fri · 7:30 PM",
    venue: "The Tipsy Cactus",
  },
  {
    title: "DJ Glow Session",
    when: "Sat · 10:30 PM",
    venue: "Club Neon",
  },
];

export default function EventsScreen() {
  return (
    <NeonScreen gradient={gradients.events}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={[typography.screenTitle, styles.title]}>Events</Text>
          <Text style={[typography.screenSubtitle, styles.subtitle]}>
            Live music, karaoke, trivia & more
          </Text>
        </View>

        <View style={styles.listWrap}>
          {EVENTS.map((event) => (
            <EventCard
              key={`${event.title}-${event.when}`}
              title={event.title}
              when={event.when}
              venue={event.venue}
            />
          ))}
        </View>
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
    ...typography.screenHeaderContainer,
    marginTop: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 0,
  },
  listWrap: {
    gap: 10,
    marginTop: 6,
    paddingBottom: 8,
  },
});
