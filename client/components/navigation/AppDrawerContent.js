import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NightOwlzIcon from "../common/NightOwlzIcon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

function DrawerItem({ icon, label, onPress, danger }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
      <Ionicons
        name={icon}
        size={20}
        color={danger ? colors.neonPink : colors.white}
        style={styles.itemIcon}
      />
      <Text style={[styles.itemLabel, danger && { color: colors.neonPink }]}>{label}</Text>
    </Pressable>
  );
}

export default function AppDrawerContent({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, token, logout } = useAuth();
  const [savedCount, setSavedCount] = useState(null);

  const displayName = user?.username?.trim() || "Night Owlz";
  const handle = user?.username ? `@${user.username.trim().toLowerCase()}` : "";

  useEffect(() => {
    if (!token) return;
    api.get("/saved-bars", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setSavedCount((data.bars || []).length))
      .catch(() => setSavedCount(0));
  }, [token]);

  const handleProfile = () => {
    navigation.closeDrawer();
    navigation.navigate("Profile");
  };

  const handleLogout = () => {
    navigation.closeDrawer();
    logout();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      {/* Profile section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrap}>
          <NightOwlzIcon size={52} color={colors.neonYellow} glowEnabled />
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        {!!handle && <Text style={styles.handle}>{handle}</Text>}
        {savedCount !== null && (
          <View style={styles.statChip}>
            <Ionicons name="heart" size={12} color={colors.neonYellow} />
            <Text style={styles.statText}>{savedCount} saved bar{savedCount !== 1 ? "s" : ""}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Nav items */}
      <View style={styles.nav}>
        <DrawerItem icon="person-outline" label="My Profile" onPress={handleProfile} />
      </View>

      <View style={styles.divider} />

      {/* Bottom actions */}
      <View style={styles.bottom}>
        <DrawerItem icon="log-out-outline" label="Logout" onPress={handleLogout} danger />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "flex-start",
    paddingBottom: 24,
  },
  avatarWrap: {
    marginBottom: 14,
  },
  displayName: {
    ...typography.subheading,
    fontSize: 22,
    lineHeight: 28,
    color: colors.white,
    marginBottom: 4,
  },
  handle: {
    ...typography.caption,
    color: colors.muted,
    marginBottom: 12,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.3)",
    backgroundColor: "rgba(255, 184, 92, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.neonYellow,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 8,
  },
  nav: {
    paddingVertical: 8,
  },
  bottom: {
    marginTop: "auto",
    paddingTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  itemPressed: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  itemIcon: {
    marginRight: 14,
  },
  itemLabel: {
    ...typography.body,
    fontSize: 16,
    color: colors.white,
  },
});
