import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import typography from "../../theme/typography";

import { useTheme } from "../../theme/ThemeProvider";
import NeonButton from "../../components/common/NeonButton";

function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  return (
    <View style={styles.settingRow}>
      <Text style={[typography.body, { color: colors.white }]}>Dark Mode</Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        thumbColor={theme === "dark" ? colors.neonYellow : colors.neonBlue}
        trackColor={{ false: "#888", true: colors.glowYellow }}
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
  const { colors } = useTheme();
  return (
    <NeonScreen gradient={gradients.settings}>
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
          Settings
        </Text>
        <Text
          style={[
            typography.tagline,
            styles.subtitle,
            {
              color: colors.neonBlue,
              textShadowColor: colors.glowBlue,
              textShadowRadius: 8,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          Notifications, preferences & more
        </Text>
      </View>
      <View style={styles.settingsList}>
        <ThemeToggle />
        <NeonButton
          label="Coming Soon"
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
    alignItems: "center",
    marginTop: 48,
    marginBottom: 32,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 0,
  },
  settingsList: {
    marginTop: 16,
    paddingHorizontal: 24,
    gap: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  // No logoutRow needed
});
