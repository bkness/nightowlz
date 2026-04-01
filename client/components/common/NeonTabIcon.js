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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function NeonTabIcon({ name, label, focused, color }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <Ionicons
        name={name}
        size={focused ? 40 : 30}
        color={color}
        style={focused ? styles.glow(color) : null}
      />
      {focused ? (
        <View
          style={[
            styles.pill,
            { borderColor: color, backgroundColor: color + "22" },
          ]}
        >
          <Text
            style={[
              typography.label,
              { color: colors.white, fontWeight: "700", fontSize: 16 },
              styles.glow(color),
            ]}
          >
            {label}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            typography.label,
            { color },
            focused ? styles.glow(color) : null,
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8, // 8px
    minWidth: 93,
    height: "auto",
  },

  glow: (color) => ({
    textShadowColor: color,
    textShadowRadius: 5,
    textShadowOffset: { width: 0, height: 0 },
  }),
  pill: {
    paddingHorizontal: 12, // 8px * 1.5
    paddingVertical: 8, // 8px
    borderRadius: 16,
    borderWidth: 2,
    alignSelf: "center",
    width: "100%",
    maxWidth: 100,
    marginTop: 8, // 8px
    marginBottom: 0,
    shadowColor: colors.neonBlue,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
