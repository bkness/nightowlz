const messages = [
  "Go to Bar Profile (Dev)",
  "Go to User Profile (Dev)",
  "Go to Settings (Dev)",
  "Email",
  "Username",
  "Password",
  "Login",
  "Sign Up",
];

const errorMessages = {
  emailRequired: "Email is required.",
  usernameRequired: "Username is required.",
  passwordRequired: "Password is required.",
  invalidEmail: "Enter a valid email address.",
  usernameTooShort: "Username must be at least 3 characters.",
  passwordTooShort: "Password must be at least 6 characters.",
  invalidCredentials: "Invalid email/username or password.",
  signUpFailed: "Sign up failed. Please try again.",
  loginFailed: "Login failed. Please try again.",
  networkError: "Network error. Please try again later.",
};

export { messages, errorMessages };
