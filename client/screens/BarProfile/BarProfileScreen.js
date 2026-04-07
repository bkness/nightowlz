import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, Linking } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import NeonScreen from "../../components/common/NeonScreen";
import { gradients } from "../../theme";
import Header from "../../components/layout/Header";
import NeonButton from "../../components/common/NeonButton";
import typography from "../../theme/typography";
import colors from "../../theme/colors";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

function formatDistance(distanceMeters) {
  if (typeof distanceMeters !== "number") return "";
  if (distanceMeters < 1000) return `${distanceMeters} m from center`;
  const miles = distanceMeters / 1609.34;
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi from center`;
}

function normalizeWebsiteUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export default function BarProfileScreen({ route, navigation }) {
  const { token } = useAuth();
  const bar = route.params?.bar || { name: "Unknown Bar", neighborhood: "TBD", vibe: "" };
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isSaved = route.params?.isSaved || false;

  const hasMap = typeof bar.lat === "number" && typeof bar.lon === "number";

  const handleSave = async () => {
    if (!token) {
      Alert.alert("Sign in required", "Please log in to save bars.");
      return;
    }
    setSaving(true);
    try {
      await api.post(
        "/saved-bars",
        {
          barId: bar.barId,
          name: bar.name,
          vibe: bar.vibe || "",
          neighborhood: bar.neighborhood || "",
          category: bar.category || "",
          openingHours: bar.openingHours || "",
          lat: bar.lat ?? null,
          lon: bar.lon ?? null,
          source: bar.source || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Saved!", `${bar.name} added to My Bars.`);
      navigation.navigate("MyBars");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not save bar.";
      console.error("Save error:", msg);
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      Alert.alert("Sign in required", "Please log in to remove bars.");
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/saved-bars/${bar.barId}`, { headers: { Authorization: `Bearer ${token}` }, });
      Alert.alert("Removed", `${bar.name} from My Bars.`);
      navigation.navigate("MyBars");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not remove bar.";
      console.error("Delete error:", msg);
      Alert.alert("Error", msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleCall = () => {
    if (bar.phone) Linking.openURL(`tel:${bar.phone}`);
  };

  const handleDirections = () => {
    if (hasMap) {
      Linking.openURL(`maps://app?daddr=${bar.lat},${bar.lon}`);
    }
  };

  const handleWebsite = () => {
    const url = normalizeWebsiteUrl(bar.website);
    if (url) {
      Linking.openURL(url);
    }
  };

  const detailLines = Array.isArray(bar.addressLines) && bar.addressLines.length > 0
    ? bar.addressLines
    : [bar.neighborhood].filter(Boolean);

  return (
    <NeonScreen gradient={gradients.myBars}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />

        <Text style={styles.name}>{bar.name}</Text>
        {!!bar.category && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{bar.category}</Text>
          </View>
        )}
        {!!bar.neighborhood && (
          <Text style={styles.neighborhood}>{bar.neighborhood}</Text>
        )}
        {!!bar.distanceMeters && (
          <Text style={styles.distance}>{formatDistance(bar.distanceMeters)}</Text>
        )}
        {!!bar.openingHours && (
          <Text style={styles.hours}>{bar.openingHours}</Text>
        )}

        {detailLines.length > 0 && (
          <View style={styles.infoCard}>
            {detailLines.map((line) => (
              <Text key={line} style={styles.infoLine}>{line}</Text>
            ))}
            {!!bar.phone && <Text style={styles.infoMeta}>{bar.phone}</Text>}
            {!!bar.website && <Text style={styles.infoMeta}>{bar.website}</Text>}
          </View>
        )}

        {hasMap && (
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: bar.lat,
              longitude: bar.lon,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{ latitude: bar.lat, longitude: bar.lon }}
              title={bar.name}
              pinColor={colors.neonYellow}
            />
          </MapView>
        )}

        {(saving || deleting) ? (
          <ActivityIndicator color={colors.neonYellow} style={{ marginVertical: 16 }} />
        ) : (
          <>
            {(isSaved ? null : <NeonButton title="Save to My Bars" onPress={handleSave} />) || (isSaved && <NeonButton title="Remove From My Bars" onPress={handleDelete} />)}   
          </>
        )}

        <View style={styles.buttonRow}>
          {!!bar.phone && (
            <View style={styles.buttonHalf}>
              <NeonButton title="Call" onPress={handleCall} />
            </View>
          )}
          {!!bar.website && (
            <View style={styles.buttonHalf}>
              <NeonButton title="Website" onPress={handleWebsite} />
            </View>
          )}
          {hasMap && (
            <View style={styles.buttonHalf}>
              <NeonButton title="Directions" onPress={handleDirections} />
            </View>
          )}
        </View>
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  name: {
    ...typography.heading,
    textAlign: "center",
    marginTop: 16,
  },
  categoryPill: {
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 0, 0.16)",
    borderWidth: 1,
    borderColor: colors.neonYellow,
  },
  categoryPillText: {
    ...typography.caption,
    color: colors.neonYellow,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  neighborhood: {
    ...typography.caption,
    textAlign: "center",
    marginTop: 8,
  },
  distance: {
    ...typography.caption,
    textAlign: "center",
    marginTop: 6,
    color: colors.neonBlue,
  },
  hours: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  infoCard: {
    marginTop: 18,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  infoLine: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
    marginBottom: 4,
  },
  infoMeta: {
    ...typography.caption,
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
  },
  map: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  buttonHalf: {
    flex: 1,
  },
});
