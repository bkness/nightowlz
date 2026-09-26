import { Alert, Platform } from "react-native";

// Drop-in for Alert.alert(title, message, buttons). On react-native-web,
// Alert.alert is a no-op: errors never showed and button callbacks never
// ran (sign-up looked dead when the username was taken). On web, use the
// browser's dialogs — confirm() when there's a choice, alert() otherwise.
export default function showAlert(title, message, buttons) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;
  const cancel = buttons?.find((b) => b.style === "cancel");
  const action = buttons?.find((b) => b.style !== "cancel");

  if (cancel && action) {
    (window.confirm(text) ? action : cancel).onPress?.();
  } else {
    window.alert(text);
    buttons?.[0]?.onPress?.();
  }
}
