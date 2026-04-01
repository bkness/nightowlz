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

export default function NeonButton({ title, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
      <LinearGradient
        colors={["#7F3DFF", "#A259FF", "#FF932E"]}
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
    shadowColor: colors.glowPurple,
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },

    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(201, 150, 255, 0.45)",
  },

  text: {
    ...typography.buttonLabel,
  },
});
