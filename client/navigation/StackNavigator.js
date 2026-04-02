import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Easing } from "react-native";
import { colors } from "../theme";
import TabNavigator from "./TabNavigator";
import BarProfileScreen from "../screens/BarProfile/BarProfileScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignupScreen";

const Stack = createNativeStackNavigator();
const INITIAL_ROUTE = __DEV__ ? "HomeTabs" : "Login";

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerTintColor: colors.neonYellow,
        animation: "slide_from_right",
        animationDuration: 350,
        animationEasing: Easing.out(Easing.quad),
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
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
    </Stack.Navigator>
  );
}
