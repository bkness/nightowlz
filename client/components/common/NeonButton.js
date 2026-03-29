// import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import colors from "../theme/colors";

// export default function NeonButton({ title, onPress }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.wrapper}>
//       <LinearGradient
//         colors={[colors.neonOrange, colors.neonYellow]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.button}
//       >
//         <Text style={styles.text}>{title}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     marginVertical: 10,
//   },
//   button: {
//     paddingVertical: 14,
//     borderRadius: 12,
//     shadowColor: colors.neonOrange,
//     shadowOpacity: 0.8,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 0 },
//   },
//   text: {
//     color: colors.background,
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//   },
// });

// import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import colors from "../theme/colors";

// export default function NeonButton({ title, onPress }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.wrapper}>
//       <LinearGradient
//         colors={[colors.neonOrange, colors.neonYellow]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.button}
//       >
//         <Text style={styles.text}>{title}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     marginVertical: 10,
//   },
//   button: {
//     paddingVertical: 14,
//     borderRadius: 12,
//     shadowColor: colors.neonOrange,
//     shadowOpacity: 0.8,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 0 },
//   },
//   text: {
//     color: colors.background,
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//   },
// });

import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

export default function NeonButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <LinearGradient
        colors={[colors.neonOrange, colors.neonYellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 14,

    // Neon glow
    shadowColor: colors.glowYellow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },

    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.4)",
  },

  text: {
    ...typography.buttonLabel,
  },
});
