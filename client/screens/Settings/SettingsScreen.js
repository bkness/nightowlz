import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients, surfaces } from "../../theme";
import typography from "../../theme/typography";

import { useTheme } from "../../theme/ThemeProvider";
import NeonButton from "../../components/common/NeonButton";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitleBlock
          title="Settings"
          subtitle="Notifications, preferences & more"
          colors={colors}
          style={styles.headerContainer}
        />
        <View style={styles.settingsList}>
          <ThemeToggle />
          <NeonButton
            title="Coming Soon"
            onPress={() => Alert.alert("Feature coming soon!")}
            style={styles.comingSoonButton}
          />
          <AppVersion />
        </View>
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
  settingsList: {
    ...surfaces.neonCard,
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 8,
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
  comingSoonButton: {
    marginTop: -2,
    marginBottom: -6,
  },
});
