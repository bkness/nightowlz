import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const BOTTOM_SPECKLES = [
  { left: "8%", bottom: 34, size: 5, opacity: 0.45 },
  { left: "16%", bottom: 26, size: 3, opacity: 0.4 },
  { left: "24%", bottom: 40, size: 4, opacity: 0.52 },
  { left: "36%", bottom: 22, size: 5, opacity: 0.35 },
  { left: "47%", bottom: 30, size: 3, opacity: 0.48 },
  { left: "58%", bottom: 18, size: 4, opacity: 0.44 },
  { left: "71%", bottom: 35, size: 5, opacity: 0.46 },
  { left: "84%", bottom: 27, size: 3, opacity: 0.42 },
];

function BottomAtmosphere() {
  return (
    <View pointerEvents="none" style={styles.bottomAtmosphereWrap}>
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(255, 72, 24, 0.07)",
          "rgba(255, 136, 0, 0.09)",
          "rgba(255, 56, 0, 0.12)",
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomGlow}
      />
      {BOTTOM_SPECKLES.map((dot, idx) => (
        <View
          key={idx}
          style={[
            styles.speck,
            {
              left: dot.left,
              bottom: dot.bottom,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function NeonScreen({
  children,
  gradient,
  showBottomSpeckle = true,
}) {
  return (
    <LinearGradient colors={gradient} style={styles.container}>
      {children}
      {showBottomSpeckle ? <BottomAtmosphere /> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bottomAtmosphereWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 210,
  },
  speck: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FF8A2B",
    shadowColor: "#FF4A00",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
