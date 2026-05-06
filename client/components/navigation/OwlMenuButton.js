import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NightOwlzIcon from "../common/NightOwlzIcon";
import colors from "../../theme/colors";

export default function OwlMenuButton() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Animated.View
      entering={FadeIn.duration(500).delay(300)}
      style={[styles.container, { top: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        hitSlop={14}
      >
        <NightOwlzIcon size={38} color={colors.neonYellow} glowEnabled />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 18,
    zIndex: 100,
  },
  button: {
    padding: 4,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
