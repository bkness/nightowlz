import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
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

        {/* PRIMARY ACTION */}
        <NeonButton
          title="Add To My Bars"
          onPress={() => navigation.navigate("MyBars")}
        />

        {/* SECONDARY ACTIONS: SIDE-BY-SIDE */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <NeonButton
              title="Call"
              onPress={() => console.log("Call pressed")}
            />
          </View>
          <View style={styles.buttonHalf}>
            <NeonButton
              title="Directions"
              onPress={() => console.log("Directions pressed")}
            />
          </View>
        </View>
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // 8px * 2
    paddingBottom: 40,
  },

  name: {
    ...typography.heading,
    textAlign: "center",
    marginTop: 16, // 8px * 2
  },

  neighborhood: {
    ...typography.caption,
    textAlign: "center",
    marginTop: 8, // 8px
  },

  vibe: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 8, // 8px
    lineHeight: 20,
  },

  desc: {
    ...typography.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: 16, // 8px * 2
    marginBottom: 24, // 8px * 3
  },

  buttonRow: {
    flexDirection: "row",
    gap: 8, // 8px spacing between buttons
    marginTop: 8, // 8px
  },

  buttonHalf: {
    flex: 1,
  },
});
