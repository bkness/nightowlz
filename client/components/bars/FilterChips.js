import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import colors from "../../theme/colors";
import typography from "../../theme/typography";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MODE_COLORS = {
  bars:          colors.neonYellow,
  clubs:         colors.neonPink,
  live_music:    colors.neonBlue,
  entertainment: colors.neonViolet,
};

export default function FilterChips({ options, selected, onToggle }) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const accent = MODE_COLORS[option.id] ?? colors.neonYellow;
        return (
          <AnimatedPressable
            key={option.id}
            onPress={() => onToggle(option.id)}
            style={[
              styles.chip,
              {
                flexGrow: isSelected ? 2 : 1,
                borderColor: isSelected ? accent : colors.muted,
                backgroundColor: isSelected ? accent + "22" : "rgba(255,255,255,0.04)",
                boxShadow: isSelected ? `0 0 10px 2px ${accent}99` : "none",
                transitionProperty: "flexGrow",
                transitionDuration: 260,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isSelected ? accent : colors.muted },
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  chip: {
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  label: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
