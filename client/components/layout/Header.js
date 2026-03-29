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

import { View, Text, StyleSheet } from "react-native";
import typography from "../../theme/typography";

export default function Header({ compact = false }) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Text style={typography.logo}>BarFly</Text>
      <Text style={typography.tagline}>Find Your Night</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...typography.headerContainer,
  },
  compact: {
    marginTop: 20,
    marginBottom: 10,
  },
});
