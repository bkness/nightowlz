import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Easing } from "react-native";
import { colors } from "../theme";
import TabNavigator from "./TabNavigator";
import BarProfileScreen from "../screens/BarProfile/BarProfileScreen";
import SignUpScreen from "../screens/Auth/SignupScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import DiscoverScreen from "../screens/Discover/DiscoverScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background, padding: 0 },
        headerTintColor: colors.neonOrange,
        animation: "slide_from_right",
        animationDuration: 280,
        animationEasing: Easing.out(Easing.cubic),
        fullScreenGestureEnabled: true,
        gestureEnabled: true,
      }}
    >
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
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          title: "Sign Up",
          animation: "fade_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
