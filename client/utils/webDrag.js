import { Platform } from "react-native";

// Styles for anything driven by a gesture-handler Pan on web. Without
// userSelect:none, pressing on text starts the browser's text-selection
// drag, which steals the pointer — cards only dragged from their blank
// spots. touchAction tells mobile browsers which moves are ours:
//   "none"  → every direction (the Discover swipe deck)
//   "pan-y" → horizontal is ours, vertical still scrolls the page/list
export function webDraggable(touchAction = "none") {
  if (Platform.OS !== "web") return null;
  return { userSelect: "none", cursor: "grab", touchAction };
}
