import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/Auth/LoginScreen";
import SignUpScreen from "../../screens/Auth/SignupScreen";
import {
  authScreenOptions,
  authStackOptions,
  baseStackScreenOptions,
} from "../options/stackOptions";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={authStackOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={authScreenOptions}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={authScreenOptions}
      />
    </Stack.Navigator>
  );
}