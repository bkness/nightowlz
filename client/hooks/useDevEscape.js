import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function useDevEscape() {
  const { login } = useAuth();

  return useCallback(() => {
    if (!__DEV__) return;

    // Flipping auth state is enough; StackNavigator will remount into HomeTabs.
    login();
  }, [login]);
}
