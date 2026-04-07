import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainStack from "../stacks/MainStack";
import SettingsModalScreen from "../modals/SettingsModalScreen";
import {
  baseStackScreenOptions,
  transparentModalScreenOptions,
} from "../options/stackOptions";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={baseStackScreenOptions}>
      <Stack.Screen
        name="MainStack"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={transparentModalScreenOptions}>
        <Stack.Screen
          name="SettingsModal"
          component={SettingsModalScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}