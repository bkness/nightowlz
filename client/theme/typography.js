import { RFValue } from "react-native-responsive-fontsize";
import colors from "./colors";

const glow = (color, radius = 18, offset = { width: 0, height: 0 }) => ({
  textShadowColor: color,
  textShadowRadius: radius,
  textShadowOffset: offset,
});

const typography = {
  logo: {
    fontFamily: "Pacifico",
    fontSize: RFValue(42),
    color: colors.neonYellow,
    letterSpacing: 1,
    lineHeight: RFValue(52),
    ...glow(colors.glowYellow, 12),
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  tagline: {
    fontFamily: "Lobster",
    fontSize: RFValue(20),
    color: colors.neonBlue,
    lineHeight: RFValue(28),
    marginTop: -4,
    marginBottom: 12,
    ...glow(colors.glowBlue, 12),
  },

  screenTitle: {
    fontFamily: "Pacifico",
    fontSize: RFValue(38),
    lineHeight: RFValue(52),
    letterSpacing: 0.8,
    marginTop: 0,
    padding: 8,
    paddingTop: 10,
    color: colors.neonYellow,
    textAlign: "center",
    ...glow(colors.glowYellow, 12),
  },

  screenSubtitle: {
    fontFamily: "Lobster",
    fontSize: RFValue(18),
    lineHeight: RFValue(24),
    letterSpacing: 0.2,
    marginTop: -12,
    color: colors.neonBlue,
    textAlign: "center",
    ...glow(colors.glowBlue, 10),
  },

  heading: {
    fontSize: RFValue(28),
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
    lineHeight: RFValue(36),
  },

  subheading: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: colors.white,
    lineHeight: RFValue(28),
  },

  body: {
    fontSize: RFValue(14),
    color: colors.white,
    lineHeight: RFValue(22),
  },

  caption: {
    fontSize: RFValue(13),
    fontWeight: "500",
    letterSpacing: 0.2,
    color: colors.muted,
    lineHeight: RFValue(18),
  },

  label: {
    fontSize: RFValue(11),
    fontWeight: "500",
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 0.1,
    textAlign: "center",
    lineHeight: RFValue(16),
  },

  buttonLabel: {
    fontSize: RFValue(18),
    fontWeight: "800",
    color: colors.background,
    letterSpacing: 0.8,
    textAlign: "center",
    lineHeight: RFValue(24),
  },

  formSubtitle: {
    fontSize: RFValue(14),
    color: colors.neonBlue,
    lineHeight: RFValue(22),
    textAlign: "center",
    marginBottom: 24,
  },

};

export default typography;
