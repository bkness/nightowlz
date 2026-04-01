import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { gradients, typography, colors } from "../../theme";
import { NeonScreen, BrandMark } from "../../components/common";
import { useNavigation } from "@react-navigation/native";
import { errorMessages } from "../../utils";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const successOpacity = useRef(new Animated.Value(0)).current;
  const redirectTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const mapSignupError = (message) => {
    const msg = String(message || "").toLowerCase();
    if (msg.includes("network") || msg.includes("failed to fetch")) {
      return errorMessages.networkError;
    }
    return message || errorMessages.signUpFailed;
  };

  const handleSignUp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (!normalizedEmail) {
      setError(errorMessages.emailRequired);
      return;
    }
    if (!normalizedEmail.includes("@")) {
      setError(errorMessages.invalidEmail);
      return;
    }
    if (!normalizedUsername) {
      setError(errorMessages.usernameRequired);
      return;
    }
    if (normalizedUsername.length < 3) {
      setError(errorMessages.usernameTooShort);
      return;
    }
    if (!password) {
      setError(errorMessages.passwordRequired);
      return;
    }
    if (password.length < 6) {
      setError(errorMessages.passwordTooShort);
      return;
    }

    setLoading(true);
    setError("");
    const result = await signUp({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role: "user",
    });
    setLoading(false);

    if (!result.ok) {
      setError(mapSignupError(result.message));
      return;
    }

    setSuccess("Account created! Redirecting to Discover...");
    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    redirectTimer.current = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeTabs", params: { screen: "Discover" } }],
      });
    }, 900);
  };

  return (
    <NeonScreen gradient={gradients.discover}>
      <View style={styles.container}>
        <BrandMark size={88} animated={true} />
        <Text
          style={[typography.screenSubtitle, typography.center, styles.sub]}
        >
          Create your account
        </Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.muted}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? (
            <Animated.Text
              style={[styles.successText, { opacity: successOpacity }]}
            >
              {success}
            </Animated.Text>
          ) : null}

          <Pressable
            style={styles.buttonPrimary}
            onPress={handleSignUp}
            disabled={loading || Boolean(success)}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating..." : "Create Account"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </Pressable>
        </View>
      </View>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  sub: {
    marginTop: 12,
    marginBottom: 26,
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    padding: 16,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    color: colors.textPrimary,
    marginBottom: 14,
    ...typography.body,
  },
  buttonPrimary: {
    backgroundColor: colors.neonOrange,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: "rgba(162, 89, 255, 0.24)",
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 12,
  },
  buttonText: {
    ...typography.buttonLabel,
  },
  errorText: {
    ...typography.caption,
    color: "#FF7C9A",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 18,
    flexWrap: "wrap",
    paddingHorizontal: 6,
  },
  successText: {
    ...typography.caption,
    color: "#8BFFB3",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 18,
    flexWrap: "wrap",
    paddingHorizontal: 6,
  },
});
