import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import { gradients, surfaces, typography } from "../../theme";
import colors from "../../theme/colors";

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    __DEV__ || (identifier.trim().length > 0 && password.length > 0);

  const handleLogin = () => {
    if (!canSubmit) return;
    navigation.replace("HomeTabs");
  };

  return (
    <NeonScreen gradient={gradients.discover}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <Text style={styles.title}>Welcome Back</Text>
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

        <NeonButton title="Login" onPress={handleLogin} disabled={!canSubmit} />

        {__DEV__ && (
          <NeonButton
            title="Continue to App"
            onPress={() => navigation.replace("HomeTabs")}
          />
        )}

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
