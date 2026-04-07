import 'dotenv/config';
export default {
  name: "Night Owlz",
  slug: "night-owlz-client",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#07121C",
  },

  ios: {
    bundleIdentifier: "com.barfly.client",
    supportsTablet: true,
  },

  android: {
    package: "com.barfly.client",
    adaptiveIcon: {
      backgroundColor: "#041018",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },

  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  },
};
