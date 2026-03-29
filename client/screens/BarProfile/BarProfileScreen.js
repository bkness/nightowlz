import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import NeonScreenPurple from "../components/NeonScreenPurple";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import Header from "../../components/layout/Header";
import NeonButton from "../../components/common/NeonButton";
import typography from "../../theme/typography";
import colors from "../../theme/colors";

export default function BarProfileScreen({ route, navigation }) {
  const bar = route.params?.bar || {
    name: "Unknown Bar",
    neighborhood: "TBD",
    vibe: "Mixed",
  };

  return (
    <NeonScreen gradient={gradients.myBars}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />

        {/* BAR NAME */}
        <Text style={styles.name}>{bar.name}</Text>
        <Text style={styles.neighborhood}>{bar.neighborhood}</Text>
        <Text style={styles.vibe}>{bar.vibe}</Text>

        {/* DESCRIPTION */}
        <Text style={styles.desc}>
          Signature cocktails, upbeat playlists, and a social crowd that keeps
          the energy high.
        </Text>

        {/* BUTTONS */}
        <NeonButton
          title="Add To My Bars"
          onPress={() => navigation.navigate("MyBars")}
        />
        <NeonButton title="Call" onPress={() => console.log("Call pressed")} />
        <NeonButton
          title="Directions"
          onPress={() => console.log("Directions pressed")}
        />
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  name: {
    ...typography.heading,
    textAlign: "center",
    marginTop: 10,
  },

  neighborhood: {
    ...typography.caption,
    textAlign: "center",
    marginTop: 4,
  },

  vibe: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 4,
  },

  desc: {
    ...typography.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 20,
  },
});
