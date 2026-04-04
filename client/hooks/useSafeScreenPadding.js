import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getSafeTopOffset } from "../theme/layout";

export default function useSafeScreenPadding(options = {}) {
  const insets = useSafeAreaInsets();
  const {
    topBasePadding = 8,
    topMin = 20,
    bottomMin = 16,
    bottomExtra = 0,
  } = options;

  return useMemo(
    () => ({
      paddingTop: getSafeTopOffset(insets.top, {
        basePadding: topBasePadding,
        min: topMin,
      }),
      paddingBottom: Math.max(insets.bottom + bottomExtra, bottomMin),
    }),
    [insets.top, insets.bottom, topBasePadding, topMin, bottomMin, bottomExtra]
  );
}
