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
import { useAuth } from "../../context/AuthContext";
import SettingRow from "../../components/common/SettingRow";

function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  return (
    <SettingRow label="Dark Mode" colors={colors}>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        thumbColor={theme === "dark" ? colors.neonYellow : colors.neonBlue}
        trackColor={{ false: "#888", true: colors.glowYellow }}
      />
    </SettingRow>
  );
}

function AppVersion() {
  const { colors } = useTheme();
  return (
    <SettingRow label="App Version" colors={colors} showDivider={false}>
      <Text style={[typography.caption, { color: colors.muted }]}>1.0.0</Text>
    </SettingRow>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

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
        <NeonButton
          title="Log Out"
          onPress={handleLogout}
          style={styles.logoutButton}
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
  settingsList: {
    ...surfaces.neonCard,
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 24,
  },
  comingSoonButton: {
    marginTop: -2,
    marginBottom: -6,
  },
  logoutButton: {
    marginTop: 32,
    marginBottom: 8,
  },
});
