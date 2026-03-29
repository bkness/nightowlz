import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Easing } from "react-native-reanimated";
import { colors } from "../theme";
import TabNavigator from "./TabNavigator";
import BarProfileScreen from "../screens/BarProfile/BarProfileScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
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
