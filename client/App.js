import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Auth/LoginScreen";
import StackNavigator from "./navigation/StackNavigator";
import { useFonts } from "expo-font";
import { ThemeProvider } from "./theme";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Pacifico: require("./assets/fonts/Pacifico/Pacifico-Regular.ttf"),
    Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          {/* {user ? <StackNavigator /> : <LoginScreen />} */}
          <StackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
