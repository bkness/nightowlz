import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { gradients, typography, colors } from "../../theme";
import { NeonScreen } from "../../components/common";
import { useAuth } from "../../context/AuthContext";

export default function BarProfileScreen({ route }) {
  const { user } = useAuth();
  const [ownerEvents, setOwnerEvents] = React.useState([
    {
      id: "1",
      title: "Trivia Night",
      time: "Thu · 8:00 PM",
      status: "Published",
    },
    { id: "2", title: "Live DJ", time: "Fri · 10:30 PM", status: "Draft" },
  ]);

  const bar = route?.params?.bar || {
    name: "Belfry Brewery",
    neighborhood: "Downtown",
    vibe: "Live Band Tonight · 8:00 PM",
    phone: "(555) 010-2455",
    address: "991 N Main St, Cottonwood, AZ",
    popular: true,
    events: [
      { title: "Trivia Night", time: "8:00 PM" },
      { title: "Live DJ", time: "10:30 PM" },
    ],
  };

  const isOwner = user?.role === "bar_owner" || route?.params?.ownerPreview;

  const handleCall = async () => {
    const phone = bar.phone || "";
    const digits = phone.replace(/[^+\d]/g, "");
    if (!digits) {
      Alert.alert("Phone unavailable", "This bar has no phone listed yet.");
      return;
    }

    const url = `tel:${digits}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Unable to call", "Calling is not available on this device.");
      return;
    }

    await Linking.openURL(url);
  };

  const handleDirections = async () => {
    if (!bar.address) {
      Alert.alert("Address unavailable", "This bar has no address listed yet.");
      return;
    }

    const encodedAddress = encodeURIComponent(bar.address);
    const mapsUrl = `http://maps.apple.com/?q=${encodedAddress}`;
    const canOpen = await Linking.canOpenURL(mapsUrl);

    if (!canOpen) {
      Alert.alert("Unable to open maps", "Maps is not available right now.");
      return;
    }

    await Linking.openURL(mapsUrl);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert(
        "Login required",
        "You must be logged in to save bars. Please log in or create an account.",
      );
      return;
    }

    try {
      const saved = await AsyncStorage.getItem("savedBars");
      const savedBars = saved ? JSON.parse(saved) : [];
      const alreadySaved = savedBars.some((b) => b.id === bar.id);
      if (alreadySaved) {
        Alert.alert("Already saved", `${bar.name} is already in your bars.`);
        return;
      }
      savedBars.push(bar);
      await AsyncStorage.setItem("savedBars", JSON.stringify(savedBars));
      Alert.alert("Saved", `${bar.name} was added to your saved bars.`);
    } catch (err) {
      Alert.alert("Error", "Failed to save bar.");
    }
  };

  if (isOwner) {
    return (
      <NeonScreen gradient={gradients.myBars}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Text style={styles.name}>{bar.name}</Text>
            <Text style={styles.metaText}>{bar.address}</Text>
            <Text style={styles.description}>
              Owner Workspace: create events, manage publishing, and keep your
              bar profile up to date.
            </Text>
          </View>

          <View style={styles.eventsCard}>
            <Text style={styles.eventsTitle}>Manage Events</Text>
            {ownerEvents.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <View>
                  <Text style={styles.eventName}>{event.title}</Text>
                  <Text style={styles.metaText}>{event.time}</Text>
                </View>
                <Text style={styles.ownerStatus}>{event.status}</Text>
              </View>
            ))}
          </View>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>
              Owner Actions Coming Soon
            </Text>
            <Text style={styles.placeholderText}>
              Create event, insights, and publishing controls will be finalized
              here after UI lock.
            </Text>
          </View>
        </ScrollView>
      </NeonScreen>
    );
  }

  return (
    <NeonScreen gradient={gradients.myBars}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{bar.name}</Text>
            {bar.popular ? <Text style={styles.popular}>🔥</Text> : null}
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>{bar.neighborhood}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>{bar.vibe}</Text>
          </View>

          <Text style={styles.description}>
            Signature cocktails, warm lighting, and high-energy weekends with
            live music and rotating events.
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn} onPress={handleSave}>
            <Ionicons
              name="bookmark-outline"
              size={16}
              color={colors.neonYellow}
            />
            <Text style={styles.actionLabel}>Save</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleCall}>
            <Ionicons name="call-outline" size={16} color={colors.neonYellow} />
            <Text style={styles.actionLabel}>Call</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleDirections}>
            <Ionicons
              name="navigate-outline"
              size={16}
              color={colors.neonYellow}
            />
            <Text style={styles.actionLabel}>Directions</Text>
          </Pressable>
        </View>

        <View style={styles.eventsCard}>
          <Text style={styles.eventsTitle}>Tonight</Text>
          {(bar.events || []).map((event, index) => (
            <View key={`${event.title}-${index}`} style={styles.eventRow}>
              <Text style={styles.eventName}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 12,
    paddingBottom: 42,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    ...typography.screenTitle,
    fontSize: 34,
    lineHeight: 42,
    flexShrink: 1,
  },
  popular: {
    fontSize: 20,
    marginLeft: 8,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    ...typography.bodyMuted,
  },
  description: {
    ...typography.body,
    marginTop: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.42)",
    backgroundColor: "rgba(255, 147, 46, 0.16)",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: colors.glowOrange,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  actionLabel: {
    ...typography.caption,
    color: colors.neonYellow,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  placeholderCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    padding: 14,
    marginBottom: 14,
  },
  placeholderTitle: {
    ...typography.caption,
    color: colors.neonOrange,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  placeholderText: {
    ...typography.bodyMuted,
    lineHeight: 18,
  },
  eventsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
    marginBottom: 16,
  },
  eventsTitle: {
    ...typography.subheading,
    marginBottom: 8,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  eventName: {
    ...typography.body,
  },
  eventTime: {
    ...typography.caption,
    color: colors.secondaryBlue,
  },
  ownerStatus: {
    ...typography.caption,
    color: colors.neonOrange,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
