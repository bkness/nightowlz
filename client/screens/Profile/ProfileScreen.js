import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import NightOwlzIcon from "../../components/common/NightOwlzIcon";
import { gradients, surfaces, typography } from "../../theme";
import { useTheme } from "../../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <NeonScreen gradient={gradients.settings}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <ScreenTitleBlock
          title="Profile"
          subtitle="Your vibe, favorites, and activity"
          colors={colors}
          style={styles.headerContainer}
        />

        <View style={styles.profileWrap}>
          <View
            style={[
              styles.avatar,
              {
                borderColor: colors.neonYellow,
                shadowColor: colors.glowYellow,
              },
            ]}
          >
            <NightOwlzIcon size={56} color={colors.neonYellow} glowEnabled />
          </View>

          <Text style={[typography.subheading, styles.name]}>Night Owl</Text>
          <Text style={[typography.caption, { color: colors.neonBlue }]}>
            @barfly-user
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[typography.heading, styles.statValue]}>12</Text>
              <Text style={[typography.caption, styles.statLabel]}>
                Saved Bars
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[typography.heading, styles.statValue]}>4</Text>
              <Text style={[typography.caption, styles.statLabel]}>Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[typography.heading, styles.statValue]}>8</Text>
              <Text style={[typography.caption, styles.statLabel]}>
                Check-ins
              </Text>
            </View>
          </View>
        </View>
        <NeonButton
          title="Settings"
          onPress={() => navigation.navigate("SettingsScreen")}
          style={styles.ctaButton}
        />
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
  profileWrap: {
    ...surfaces.neonCard,
    alignItems: "center",
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  name: {
    marginTop: 14,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 22,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.22)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    lineHeight: 30,
  },
  statLabel: {
    marginTop: 2,
    textAlign: "center",
  },
});
