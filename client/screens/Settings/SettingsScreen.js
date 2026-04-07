import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { surfaces } from "../../theme";
import typography from "../../theme/typography";
import { useTheme } from "../../theme/ThemeProvider";
import NeonButton from "../../components/common/NeonButton";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import { useAuth } from "../../context/AuthContext";
import SettingRow from "../../components/common/SettingRow";

function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  return (
    (() => {
      let label;
      if (theme === "dark") {
        label = "Dark Mode";
      } else {
        label = "Light Mode";
      }
      return (
        <SettingRow label={label} colors={colors}>
          <Switch
            value={theme === "dark"}
            label={label}
            onValueChange={toggleTheme}
            thumbColor={theme === "dark" ? colors.neonYellow : colors.neonBlue}
            trackColor={{ false: "#888", true: colors.glowBlue }}
          />
        </SettingRow>)
    })())
};

function AppVersion() {
  const { colors } = useTheme();
  return (
    <SettingRow label="App Version" colors={colors} showDivider={false}>
      <Text style={[typography.caption, { color: colors.muted }]}>1.0.0</Text>
    </SettingRow>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();
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
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View style={styles.modalOuter}>
        <BlurView
          intensity={8}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <BlurView
          intensity={90}
          tint="dark"
          style={styles.cardBackdropBlur}
          pointerEvents="none"
        />
        <TouchableWithoutFeedback onPress={() => { }}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.closeButtonText, { color: colors.muted }]}>✕</Text>
            </TouchableOpacity>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ScreenTitleBlock
                title="Settings"
                subtitle="Notifications, preferences & more"
                colors={colors}
                useSafeTopInset={false}
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
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalOuter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",

  },
  modalCard: {
    ...surfaces.neonCard,
    width: "85%",
    height: "75%",
  },
  cardBackdropBlur: {
    position: "absolute",
    width: "85%",
    height: "75%",
    borderRadius: 20,
  },
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
    paddingHorizontal: 6,
    marginTop: 32,
    marginBottom: 8,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginBottom: 4,
  },
  closeButtonText: {
    fontSize: 25,
    lineHeight: 22,
  },
});
