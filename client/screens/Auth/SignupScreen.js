import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients, surfaces, typography } from "../../theme";
import colors from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import useSafeScreenPadding from "../../hooks/useSafeScreenPadding";
import { api } from "../../utils/api";

export default function SignUpScreen({ navigation }) {
  const { setSession } = useAuth();
  const safePadding = useSafeScreenPadding();
  const [isRouting, setIsRouting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const canSubmit = () => {
    return (
      username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0
    );
  };

  const getSignUpErrorMessage = (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    if (serverMessage) return serverMessage;
    if (status === 409) return "That username or email is already in use.";
    if (status === 400) return "Please check your info. Password must be at least 8 characters.";
    if (error?.message === "Network Error") {
      return "Cannot reach server. Confirm backend is running and your phone is on the same Wi-Fi.";
    }

    return "An unexpected error occurred. Please try again.";
  };

  const handleSignUp = async () => {
    if (!canSubmit()) {
      alert("Signup failed: Username, email, and password are required.");
      return;
    }

    try {
      const { data } = await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });

      setSession(data);
    } catch (error) {
      console.error(
        "Signup request failed:",
        error?.response?.data?.message || error.message,
      );
      alert("Signup failed: " + getSignUpErrorMessage(error));
      return;
    }
  };

  const handleBackToLogin = () => {
    if (isRouting) return;

    setIsRouting(true);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Login");
    }

    setTimeout(() => setIsRouting(false), 400);
  };

  return (
    <NeonScreen gradient={gradients.events} liftDistance={0}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, safePadding]}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start building your BarFly favorites
          </Text>

          <View style={styles.roleRow}>
            <Pressable
              onPress={() => setSelectedRole("user")}
              style={[
                styles.roleChip,
                selectedRole === "user" && styles.roleChipActive,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === "user" && styles.roleTextActive,
                ]}
              >
                User
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedRole("owner")}
              style={[
                styles.roleChip,
                selectedRole === "owner" && styles.roleChipActive,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === "owner" && styles.roleTextActive,
                ]}
              >
                Owner
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <TextInput
              ref={usernameRef}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={() => emailRef.current?.focus()}
              returnKeyType="next"
              style={[
                styles.input,
                focusedField === "username" && styles.inputFocused,
              ]}
            />
            <TextInput
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              returnKeyType="next"
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
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
              onSubmitEditing={handleSignUp}
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
            />
          </View>

          <NeonButton
            title="Sign Up"
            onPress={handleSignUp}
            disabled={!canSubmit()}
          />

          <Pressable onPress={handleBackToLogin} disabled={isRouting}>
            <Text style={styles.switchText}>Already have an account? Login</Text>
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
  inputFocused: {
    borderColor: colors.neonYellow,
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  switchText: {
    ...typography.caption,
    color: colors.neonYellow,
    textAlign: "center",
    marginTop: 10,
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
    justifyContent: "center",
  },
  roleChip: {
    ...surfaces.glassField,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 88,
    alignItems: "center",
  },
  roleChipActive: {
    borderColor: colors.neonYellow,
    shadowColor: colors.glowYellow,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  roleText: {
    ...typography.caption,
    color: colors.muted,
  },
  roleTextActive: {
    color: colors.neonYellow,
  },
});
