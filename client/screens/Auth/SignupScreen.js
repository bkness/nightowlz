import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients, surfaces, typography } from "../../theme";
import colors from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import useSafeScreenPadding from "../../hooks/useSafeScreenPadding";

export default function SignUpScreen({ navigation }) {
  const { login } = useAuth();
  const safePadding = useSafeScreenPadding();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = () => {
    return (
      username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0
    );
  };

  const handleSignUp = () => {
    if (!canSubmit()) {
      console.error("Signup failed: Username, email, and password are required.");
      return;
    }

    login();
  };

  return (
    <NeonScreen gradient={gradients.events}>
      <View
        style={[
          styles.container,
          safePadding,
        ]}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Start building your BarFly favorites
        </Text>

        <View style={styles.form}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
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
            onSubmitEditing={handleSignUp}
            style={styles.input}
          />
        </View>

        <NeonButton
          title="Sign Up"
          onPress={handleSignUp}
          disabled={!canSubmit()}
        />

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.switchText}>Already have an account? Login</Text>
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
