export function getSafeTopOffset(insetTop, options = {}) {
  const { basePadding = 8, min = 20 } = options;
  return Math.max(insetTop + basePadding, min);
}
