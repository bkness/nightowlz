import { Keyboard, TouchableWithoutFeedback } from "react-native";

// Tap outside a text field to close the keyboard. The web build uses
// DismissKeyboard.web.js — on web this wrapper steals focus on mouse-up,
// so inputs only accepted typing while the mouse button was held down.
export default function DismissKeyboard({ children, onDismiss }) {
  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={() => {
        onDismiss?.();
        Keyboard.dismiss();
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
