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
    ...glow(colors.glowYellow, 18),
  },

  tagline: {
    fontFamily: "Lobster",
    fontSize: RFValue(20),
    color: colors.neonBlue,
    marginTop: -4,
    ...glow(colors.glowBlue, 12),
  },

  heading: {
    fontSize: RFValue(28),
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },

  subheading: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: colors.white,
  },

  body: {
    fontSize: RFValue(14),
    color: colors.white,
  },

  caption: {
    fontSize: RFValue(13),
    fontWeight: "500",
    letterSpacing: 0.2,
    color: colors.muted,
  },

  label: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: colors.muted,
  },

  buttonLabel: {
    fontSize: RFValue(18),
    fontWeight: "800",
    color: colors.background,
    letterSpacing: 0.8,
    textAlign: "center",
  },
};

export default typography;
