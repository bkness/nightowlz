// import { View, Text } from "react-native";
// import typography from "../theme/typography";
// export default function Header() {
//   return (
//     <View style={typography.headerContainer}>
//       <Text style={typography.barfly}>BarFly</Text>
//       <Text style={typography.tagline}>Find your night</Text>
//     </View>
//   );
// }

// import { View, Text, StyleSheet } from "react-native";
// import typography from "../../theme/typography";

// export default function Header({ compact = false }) {
//   return (
//     <View style={[styles.container, compact && styles.compact]}>
//       <Text style={typography.logo}>BarFly</Text>
//       <Text style={typography.tagline}>Find Your Night</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     ...typography.headerContainer,
//   },
//   compact: {
//     marginTop: 20,
//     marginBottom: 10,
//   },
// });

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import typography from "../../theme/typography";
import colors from "../../theme/colors";

function MiniLogo() {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const scale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });

  return (
    <Animated.View style={[styles.pill, { opacity, transform: [{ scale }] }]}>
      <Ionicons name="beer" size={70} color={colors.neonYellow} />
    </Animated.View>
  );
}

export default function Header({ compact = false }) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {/* Left: logo + tagline */}
      <View>
        <Text style={typography.logo}>BarFly</Text>
        <Text style={typography.tagline}>Find Your Night</Text>
      </View>

      {/* Right: animated mini logo */}
      <MiniLogo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...typography.headerContainer,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16, // 8px * 2
  },
  compact: {
    marginTop: 16, // 8px * 2
    marginBottom: 8, // 8px
  },
  pill: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.neonYellow,
    backgroundColor: colors.neonYellow + "15",
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    marginTop: 16, // 8px * 2
  },
  pillText: {
    ...typography.label,
    color: colors.neonYellow,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.5,
    textShadowColor: colors.glowYellow,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
});

// import React, { useEffect, useRef } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Animated from "react-native-reanimated";
// import { Ionicons } from "@expo/vector-icons";
// import typography from "../../theme/typography";
// import colors from "../../theme/colors";

// function MiniLogo() {
//   const glow = useRef(new Animated.Value(0)).current;
//   const foam = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glow, {
//           toValue: 1,
//           duration: 1200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(glow, {
//           toValue: 0,
//           duration: 1200,
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.delay(800),
//         Animated.timing(foam, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//         Animated.timing(foam, {
//           toValue: 0,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//         Animated.delay(1200),
//       ]),
//     ).start();
//   }, []);

//   const opacity = glow.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.6, 1],
//   });
//   const scale = glow.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.92, 1.08],
//   });
//   const foamY = foam.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
//   const foamOpacity = foam.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0, 1, 0],
//   });

//   return (
//     <View style={styles.mugWrapper}>
//       <Animated.View
//         style={[
//           styles.foamBubble,
//           { opacity: foamOpacity, transform: [{ translateY: foamY }] },
//         ]}
//       />
//       <Animated.View style={[styles.pill, { opacity, transform: [{ scale }] }]}>
//         {/* <Ionicons name="beer" size={28} color={colors.neonPink} /> */}
//         <Ionicons name="beer" size={28} color={colors.neonOrange} />
//       </Animated.View>
//     </View>
//   );
// }

// export default function Header({ compact = false }) {
//   return (
//     <View style={[styles.container, compact && styles.compact]}>
//       <View>
//         <Text style={typography.logo}>BarFly</Text>
//         <Text style={typography.tagline}>Find Your Night</Text>
//       </View>
//       <MiniLogo />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     ...typography.headerContainer,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   compact: {
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   mugWrapper: {
//     alignItems: "center",
//     marginTop: 18,
//   },
//   pill: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     borderWidth: 1.5,
//     borderColor: colors.neonOrange,
//     backgroundColor: colors.neonOrange + "15",
//     shadowColor: colors.glowOrange,

//     // borderColor: colors.neonPink,
//     // backgroundColor: colors.neonPink + "15",
//     // shadowColor: colors.glowPink,
//     shadowOpacity: 1,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 0 },
//   },
//   foamBubble: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: colors.neonPink,
//     shadowColor: colors.glowPink,
//     shadowOpacity: 1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 0 },
//     marginBottom: 2,
//   },
// });
