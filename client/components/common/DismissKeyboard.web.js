// Web: browsers blur a focused field when you click elsewhere on their own,
// and wrapping the form in a touchable steals focus from inputs on mouse-up.
// So this is a pass-through. See DismissKeyboard.js for the native version.
export default function DismissKeyboard({ children }) {
  return children;
}
