import { Text, StyleSheet, ScrollView } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import typography from "../../theme/typography";
import BarCard from "../../components/bars/BarCard";
import Header from "../../components/layout/Header";

export default function DiscoverScreen() {
  return (
    <NeonScreen gradient={gradients.discover}>
      <Header />
      {/* CONTENT */}
      <ScrollView style={{ paddingHorizontal: 20 }}>
        {/* Replace these with your BarCard components */}
        <BarCard
          name="Chaparral Bar"
          vibe="DJ Night Tonight"
          neighborhood="Main Street"
        />
        <BarCard
          name="Main Stage"
          vibe="Live Music - Friday 9PM"
          neighborhood="Main Street"
        />
        <BarCard
          name="Kactus Kates"
          vibe="Free JukeBox Night"
          neighborhood="Riverfront District"
        />
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  placeholderCard: {
    height: 120,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    marginBottom: 20,
  },
});
