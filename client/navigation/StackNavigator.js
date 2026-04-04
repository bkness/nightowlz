import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Easing } from "react-native";
import { colors } from "../theme";
import { useAuth } from "../context/AuthContext";

import TabNavigator from "./TabNavigator";
import BarProfileScreen from "../screens/BarProfile/BarProfileScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignupScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerTintColor: colors.neonYellow,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animation: "slide_from_right",
        animationDuration: 350,
        animationEasing: Easing.out(Easing.quad),
      }}
    >
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              animation: "fade",
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerShown: false,
              animation: "fade",
              gestureEnabled: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BarProfile"
            component={BarProfileScreen}
            options={{
              title: "Bar Profile",
              animation: "fade_from_bottom",
            }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              title: "Settings",
              animation: "fade_from_bottom",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
