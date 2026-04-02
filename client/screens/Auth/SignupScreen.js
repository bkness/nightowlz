import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients, surfaces, typography } from "../../theme";
import colors from "../../theme/colors";

export default function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    __DEV__ ||
    (username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0);

  const handleSignUp = () => {
    if (!canSubmit) return;
    navigation.replace("HomeTabs");
  };

  return (
    <NeonScreen gradient={gradients.events}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
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
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <NeonButton title="Sign Up" onPress={handleSignUp} />

        {__DEV__ && (
          <NeonButton
            title="Continue to App"
            onPress={() => navigation.replace("HomeTabs")}
          />
        )}

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
