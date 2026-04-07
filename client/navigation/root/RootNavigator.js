import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { useAuth } from "../../context/AuthContext";

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}