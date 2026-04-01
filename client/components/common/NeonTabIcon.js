// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import colors from "../../theme/colors";
// import typography from "../../theme/typography";

// export default function NeonTabIcon({ name, label, focused, color }) {
//   return (
//     <View style={styles.container}>
//       <Ionicons
//         name={name}
//         size={26}
//         color={color}
//         style={focused ? styles.glow(color) : null}
//       />
//       <Text
//         style={[
//           typography.label,

//           { color },
//           focused ? styles.glow(color) : null, // ⬅️ add this
//         ]}
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 0,
//     marginTop: 27,
//     minWidth: 60,
//     height: 54,
//   },

//   glow: (color) => ({
//     textShadowColor: color,
//     textShadowRadius: 5,
//     textShadowOffset: { width: 0, height: 0 },
//   }),
// });

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";
import typography from "../../theme/typography";

export default function NeonTabIcon({ name, label, focused, color }) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={name}
        size={focused ? 26 : 22}
        color={color}
        style={focused ? styles.glow(color) : null}
      />
      <Text
        style={[
          typography.label,
          styles.label,
          {
            color,
            fontWeight: focused ? "700" : "500",
            opacity: focused ? 1 : 0.88,
          },
          focused ? styles.glow(color) : null,
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.activeDot,
          {
            backgroundColor: focused ? color : "transparent",
            borderColor: focused ? color : "transparent",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
    height: 64,
    paddingTop: 2,
  },

  glow: (color) => ({
    textShadowColor: color,
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 0 },
  }),
  label: {
    marginTop: 3,
    letterSpacing: 0.2,
  },
  activeDot: {
    width: 14,
    height: 3,
    borderRadius: 99,
    marginTop: 5,
    borderWidth: 0,
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
