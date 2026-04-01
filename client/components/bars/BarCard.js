// import React from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { Animated } from "react-native";
// import colors from "../../theme/colors";
// import typography from "../../theme/typography";
// import useNeonPulse from "../../hooks/useNeonPulse";
// export default function BarCard({ name, vibe, neighborhood, onPress }) {
//   const neonPulse = useNeonPulse();

//   return (
//     <Pressable onPress={onPress} style={styles.card}>
//       <View style={styles.row}>
//         <Text style={styles.name}>{name}</Text>
//         <View style={styles.vibeTag}>
//           <Animated.Text style={[styles.vibeText, neonPulse]}>
//             {vibe}
//           </Animated.Text>
//         </View>
//       </View>
//       <Text style={styles.neighborhood}>{neighborhood}</Text>
//     </Pressable>
//   );
// }
// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)", // subtle glass
//     borderRadius: 18,
//     padding: 18,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255, 184, 92, 0.35)",
//     shadowColor: colors.glowYellow,
//     shadowOpacity: 0.9,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: 0 },
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   name: {
//     ...typography.subheading,
//     flexShrink: 1,
//   },
//   vibeTag: {
//     backgroundColor: "rgba(255, 184, 92, 0.15)",
//     borderRadius: 12,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   vibeText: {
//     ...typography.label,
//     color: colors.neonYellow,
//     fontWeight: "700",
//     fontSize: 13,
//     letterSpacing: 0.5,
//     textShadowColor: colors.glowYellow,
//     textShadowRadius: 8,
//     textShadowOffset: { width: 0, height: 0 },
//   },
//   neighborhood: {
//     ...typography.body,
//     color: colors.textSecondary,
//     marginTop: 8,
//   },
// });
// import React from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { Animated } from "react-native";
// import colors from "../../theme/colors";
// import typography from "../../theme/typography";
// import { useNavigation } from "@react-navigation/native";
// import BarProfileScreen from "../../screens/BarProfile/BarProfileScreen";
// import useNeonPulse from "../../hooks/useNeonPulse";

// export default function BarCard({ name, vibe, neighborhood, onPress }) {
//   //   const navigation = useNavigation();
//   //   const neonPulse = useNeonPulse();

//   //   return (
//   //     <Pressable onPress={onPress} style={styles.card}>
//   //       <View style={styles.row}>
//   //         <Text style={styles.name}>{name}</Text>
//   //         <View style={styles.vibeTag}>
//   //           <Animated.Text style={[styles.vibeText, neonPulse]}>
//   //             {vibe}
//   //           </Animated.Text>
//   //         </View>
//   //       </View>
//   //       <Text style={styles.neighborhood}>{neighborhood}</Text>
//   //     </Pressable>
//   //   );
//   // }

//   return (
//     <div className="card">
//       <img src={bar.image} className="card-img" />

//       <div className="card-content">
//         <div className="card-header">
//           <h3>{bar.name}</h3>
//           {bar.popular && <span className="badge">🔥</span>}
//         </div>

//         <p className="meta">📍 {bar.location}</p>
//         <p className="meta">🕒 {bar.time}</p>
//       </div>
//     </div>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)", // subtle glass
//     borderRadius: 18,
//     padding: 18,
//     marginBottom: 20,

//     // Neon border + glow
//     borderWidth: 1,
//     borderColor: "rgba(255, 184, 92, 0.35)",
//     shadowColor: colors.glowYellow,
//     shadowOpacity: 0.9,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: 0 },
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   name: {
//     ...typography.subheading,
//     flexShrink: 1,
//   },

//   vibeTag: {
//     backgroundColor: "rgba(255, 184, 92, 0.15)",
//     borderRadius: 12,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: colors.neonYellow,
//   },

//   vibeText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: colors.neonYellow,
//     letterSpacing: 0.5,
//   },

//   neighborhood: {
//     ...typography.caption,
//     marginTop: 6,
//   },
// });

import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import { Ionicons } from "@expo/vector-icons";

export default function BarCard({
  name,
  vibe,
  neighborhood,
  address,
  popular,
  onPress,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          {popular && <Text style={styles.popular}>🔥</Text>}
        </View>

        {/* Meta */}
        {address ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={colors.muted} />
            <Text style={styles.metaText}>{address}</Text>
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.muted} />
          <Text style={styles.metaText}>{neighborhood}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.muted} />
          <Text style={styles.metaText}>{vibe}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    ...typography.subheading,
    color: colors.textPrimary,
    flexShrink: 1,
  },

  popular: {
    fontSize: 16,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },

  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
