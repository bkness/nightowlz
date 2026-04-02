import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { useFonts } from "expo-font";
// import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./theme/ThemeProvider";

export default function App() {
  const [fontsLoaded] = useFonts({
    Pacifico: require("./assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
