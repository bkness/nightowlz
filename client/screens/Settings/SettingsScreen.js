import React from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import { NeonScreen, NeonButton } from "../../components/common";
import { gradients, typography, colors } from "../../theme";
import { useTheme } from "../../hooks";

function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  return (
    <View style={styles.settingRow}>
      <Text style={[typography.body, { color: colors.white }]}>Dark Mode</Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        thumbColor={theme === "dark" ? colors.neonOrange : colors.neonBlue}
        trackColor={{ false: "#6d6483", true: colors.glowPurple }}
      />
    </View>
  );
}

function AppVersion() {
  const { colors } = useTheme();
  return (
    <View style={styles.settingRow}>
      <Text style={[typography.body, { color: colors.white }]}>
        App Version
      </Text>
      <Text style={[typography.caption, { color: colors.muted }]}>1.0.0</Text>
    </View>
  );
}
export default function SettingsScreen() {
  return (
    <NeonScreen gradient={gradients.settings}>
      <View style={styles.headerContainer}>
        <Text style={[typography.screenTitle, styles.title]}>Settings</Text>
        <Text style={[typography.screenSubtitle, styles.subtitle]}>
          Notifications, preferences & more
        </Text>
      </View>
      <View style={styles.settingsList}>
        <ThemeToggle />
        <NeonButton
          title="Coming Soon"
          onPress={() => Alert.alert("Feature coming soon!")}
          style={{ marginTop: 8 }}
        />
        <AppVersion />
      </View>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    ...typography.screenHeaderContainer,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 0,
  },
  settingsList: {
    marginTop: 10,
    paddingHorizontal: 24,
    gap: 24,
    backgroundColor: colors.cardSoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
});
