import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients, surfaces, typography } from "../../theme";
import colors from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import useDevEscape from "../../hooks/useDevEscape";
import useSafeScreenPadding from "../../hooks/useSafeScreenPadding";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const handleDevEscape = useDevEscape();
  const safePadding = useSafeScreenPadding();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = () => {
    return identifier.trim().length > 0 && password.length > 0;
  };

  const handleLogin = () => {
    if (!canSubmit()) {
      console.error("Login failed: Email and password are required.");
      return;
    }

    login();

    setTimeout(() => {
      setIdentifier("");
      setPassword("");
    }, 300);
  };

  return (
    <NeonScreen gradient={gradients.discover}>
      <View
        style={[
          styles.container,
          safePadding,
        ]}
      >
        <Pressable onLongPress={handleDevEscape} delayLongPress={700}>
          <Text style={styles.title}>Welcome Back</Text>
        </Pressable>
        <Text style={styles.subtitle}>Sign in to keep your bars synced</Text>

        <View style={styles.form}>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Email or username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            style={styles.input}
          />
        </View>

        <NeonButton
          title="Login"
          onPress={handleLogin}
          disabled={!canSubmit()}
        />

        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.switchText}>No account? Create one</Text>
        </Pressable>
      </View>
    </NeonScreen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    ...typography.screenTitle,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.neonBlue,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    gap: 12,
    marginBottom: 12,
  },
  input: {
    ...surfaces.glassField,
    color: colors.white,
    height: 48,
    paddingHorizontal: 14,
  },
  switchText: {
    ...typography.caption,
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 10,
  },
});
