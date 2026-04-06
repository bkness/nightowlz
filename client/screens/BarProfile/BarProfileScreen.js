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

export default function BarProfileScreen({ route, navigation }) {
  const { token } = useAuth();
  const bar = route.params?.bar || { name: "Unknown Bar", neighborhood: "TBD", vibe: "" };
  const [saving, setSaving] = useState(false);

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

  const handleCall = () => {
    if (bar.phone) Linking.openURL(`tel:${bar.phone}`);
  };

  const handleDirections = () => {
    if (hasMap) {
      Linking.openURL(`maps://app?daddr=${bar.lat},${bar.lon}`);
    }
  };

  return (
    <NeonScreen gradient={gradients.myBars}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />

        <Text style={styles.name}>{bar.name}</Text>
        {!!bar.neighborhood && (
          <Text style={styles.neighborhood}>{bar.neighborhood}</Text>
        )}
        {!!bar.openingHours && (
          <Text style={styles.hours}>{bar.openingHours}</Text>
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

        {saving ? (
          <ActivityIndicator color={colors.neonYellow} style={{ marginVertical: 16 }} />
        ) : (
          <NeonButton title="Add To My Bars" onPress={handleSave} />
        )}

        <View style={styles.buttonRow}>
          {!!bar.phone && (
            <View style={styles.buttonHalf}>
              <NeonButton title="Call" onPress={handleCall} />
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
  neighborhood: {
    ...typography.caption,
    textAlign: "center",
    marginTop: 8,
  },
  hours: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
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
