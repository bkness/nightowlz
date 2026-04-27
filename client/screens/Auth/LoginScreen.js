import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import RoleToggle from "../../components/common/RoleToggle";
import { gradients, surfaces, typography } from "../../theme";
import colors from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import useDevEscape from "../../hooks/useDevEscape";
import useSafeScreenPadding from "../../hooks/useSafeScreenPadding";
import { api } from "../../utils/api";

export default function LoginScreen({ navigation }) {
  const { setSession } = useAuth();
  const handleDevEscape = useDevEscape();
  const safePadding = useSafeScreenPadding();
  const [isRouting, setIsRouting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const passwordRef = useRef(null);

  const canSubmit = () => {
    return identifier.trim().length > 0 && password.length > 0;
  };

  const getLoginErrorMessage = (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    if (serverMessage) return serverMessage;
    if (status === 401) return "Invalid password.";
    if (status === 403) return "Role does not match this account.";
    if (status === 404) return "No account found with that email or username.";
    if (error?.message === "Network Error") {
      return "Cannot reach server. Confirm backend is running and your phone is on the same Wi-Fi.";
    }

    return "An unexpected error occurred. Please try again.";
  };

  const handleLogin = async () => {
    if (!canSubmit()) {
      Alert.alert("Login Failed", "Email and password are required.");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", {
        identifier: identifier.trim(),
        password,
        role: selectedRole,
      });

      setSession(data);
    } catch (error) {
      console.error(
        "Login request failed:",
        error?.response?.data?.message || error.message,
      );
      Alert.alert("Login Failed", getLoginErrorMessage(error));
      return;
    }

    setTimeout(() => {
      setIdentifier("");
      setPassword("");
    }, 300);
  };

  const handleGoToSignUp = () => {
    if (isRouting) return;

    setIsRouting(true);
    navigation.navigate("SignUp");
    setTimeout(() => setIsRouting(false), 400);
  };

  return (
    <NeonScreen gradient={gradients.discover} liftDistance={0}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={[
            styles.container,
            safePadding,
          ]}
        >
          {__DEV__ ? (
            <Pressable onLongPress={handleDevEscape} delayLongPress={700}>
              <Text style={styles.title}>Welcome Back</Text>
            </Pressable>
          ) : (
            <Text style={styles.title}>Welcome Back</Text>
          )}
          <Text style={styles.subtitle}>Sign in to keep your bars synced</Text>

          <RoleToggle value={selectedRole} onChange={setSelectedRole} />

          <View style={styles.form}>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Email or username"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="next"
              onFocus={() => setFocusedField("identifier")}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={[
                styles.input,
                focusedField === "identifier" && styles.inputFocused,
              ]}
            />
            <TextInput
              ref={passwordRef}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoCorrect={false}
              returnKeyType="done"
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={handleLogin}
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
            />
          </View>

          <NeonButton
            title="Login"
            onPress={handleLogin}
            disabled={!canSubmit()}
          />

          <Pressable onPress={handleGoToSignUp} disabled={isRouting}>
            <Text style={styles.switchText}>No account? Create one</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
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
  subtitle: { ...typography.formSubtitle },
  form: {
    gap: 12,
    marginBottom: 12,
  },
  input: {
    ...surfaces.formInput,
  },
  inputFocused: {
    ...surfaces.formInputFocused,
  },
  switchText: {
    ...typography.caption,
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 10,
  },
});
