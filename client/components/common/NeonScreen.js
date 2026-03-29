import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function NeonScreen({ children, gradient }) {
  return (
    <LinearGradient colors={gradient} style={styles.container}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

LinearGradient;
