import themeColors from "./colors";

const surfaces = {
  glassField: {
    borderRadius: 12,
    backgroundColor: "rgba(13, 2, 23, 0.6)",
    borderWidth: 1,
    borderColor: themeColors.muted,
  },

  neonCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 184, 92, 0.28)",
    shadowColor: themeColors.glowYellow,
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },

  subtleThumb: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(123, 223, 255, 0.25)",
  },

  chipAmber: {
    backgroundColor: "rgba(255, 184, 92, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeColors.neonYellow,
  },

  glowDividerBlue: {
    height: 2,
    borderRadius: 99,
    backgroundColor: "rgba(123, 223, 255, 0.22)",
  },

  sheetBackground: {
    backgroundColor: "rgba(8, 10, 18, 0.98)",
  },
};

export default surfaces;
