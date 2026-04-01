import { RFValue } from "react-native-responsive-fontsize";
import colors from "./colors";
// import { FlipInEasyX } from "react-native-reanimated"; // Removed for build compatibility

const glow = (color, radius = 18, offset = { width: 0, height: 0 }) => ({
  textShadowColor: color,
  textShadowRadius: radius,
  textShadowOffset: offset,
});

const typography = {
  logo: {
    fontFamily: "Pacifico",
    fontSize: RFValue(42),
    color: colors.neonOrange,
    letterSpacing: 1,
    ...glow(colors.glowOrange, 12),
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 18,
  },

  title: {
    fontFamily: "Pacifico",
    fontSize: RFValue(42),
    color: colors.neonOrange,
    letterSpacing: 1,
    ...glow(colors.glowOrange, 12),
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 18,
  },

  tagline: {
    fontFamily: "Lobster",
    fontSize: RFValue(20),
    color: colors.neonBlue,
    marginTop: -4,
    marginBottom: 12,
    ...glow(colors.glowBlue, 10),
  },

  screenHeaderContainer: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 28,
  },

  screenTitle: {
    fontFamily: "Pacifico",
    fontSize: RFValue(40),
    color: colors.neonOrange,
    letterSpacing: 0.8,
    textShadowColor: colors.glowOrange,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },

  screenSubtitle: {
    fontFamily: "Lobster",
    fontSize: RFValue(20),
    color: colors.neonBlue,
    textShadowColor: colors.glowBlue,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
    marginTop: 2,
  },

  heading: {
    fontSize: RFValue(28),
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  subheading: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: colors.textPrimary,
  },

  body: {
    fontSize: RFValue(14),
    color: colors.textPrimary,
  },

  bodyMuted: {
    fontSize: RFValue(14),
    color: colors.textSecondary,
  },

  caption: {
    fontSize: RFValue(13),
    fontWeight: "500",
    letterSpacing: 0.2,
    color: colors.textSecondary,
  },

  label: {
    fontSize: RFValue(10.5),
    fontWeight: "500",
    color: colors.muted,
    marginTop: 0,
    letterSpacing: 0.35,
    textAlign: "center",
    padding: 2,
    paddingLeft: 2,
    paddingRight: 2,
    textTransform: "uppercase",
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  buttonLabel: {
    fontSize: RFValue(14),
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
    textAlign: "center",
  },

  center: {
    textAlign: "center",
  },
};

export default typography;
