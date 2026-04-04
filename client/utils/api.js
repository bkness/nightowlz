import axios from "axios";
import Constants from "expo-constants";

const rawBaseURL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL ||
  Constants.manifest2?.extra?.expoClient?.extra?.EXPO_PUBLIC_API_BASE_URL ||
  "";

const baseURL = rawBaseURL.replace(/\/$/, "");

export const api = axios.create({
  baseURL,
});
