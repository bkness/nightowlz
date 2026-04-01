import { Text, StyleSheet, View, Pressable } from "react-native";
import { gradients, typography } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { NeonButton, NeonScreen } from "../../components/common";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  if (!user) return null;

  return (
    <NeonScreen gradient={gradients.discover}>
      <View style={styles.headerRow}>
        <Text style={typography.screenTitle}>Profile</Text>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={styles.settingsIcon}
          hitSlop={10}
        >
          <Ionicons name="settings-sharp" size={24} color="#C9BEDF" />
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.metaLabel}>Signed in as</Text>
        <Text style={styles.metaValue}>{user.email}</Text>
        <Text style={styles.metaLabel}>Role</Text>
        <Text style={styles.metaValue}>{user.role}</Text>
      </View>

      <NeonButton title="Logout" onPress={logout} />
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    marginTop: 16,
    marginBottom: 18,
  },
  settingsIcon: {
    padding: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(181, 144, 255, 0.28)",
    backgroundColor: "rgba(162, 89, 255, 0.14)",
  },
  profileCard: {
    borderWidth: 1,
    borderColor: "rgba(181, 144, 255, 0.28)",
    backgroundColor: "rgba(162, 89, 255, 0.12)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    gap: 6,
  },
  metaLabel: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    ...typography.body,
    marginBottom: 10,
  },
});
