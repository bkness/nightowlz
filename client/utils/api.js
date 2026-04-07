import axios from "axios";
import Constants from "expo-constants";

function isLocalHost(host) {
  return host === "localhost" || host === "127.0.0.1";
}

function resolveFallbackBaseURL() {
  const explicitLanIp =
    process.env.EXPO_PUBLIC_DEV_LAN_IP ||
    Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_LAN_IP ||
    "";

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || "";
  const host = hostUri.split(":")[0];

  if (explicitLanIp) {
    return `http://${explicitLanIp}:3001/api`;
  }

  if (host) {
    if (isLocalHost(host)) {
      return "http://localhost:3001/api";
    }
    return `http://${host}:3001/api`;
  }

  return "http://localhost:3001/api";
}

function cleanBaseURL(url) {
  return String(url || "").replace(/\/$/, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildBaseURLCandidates() {
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL;
  const configBase = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;
  const manifestBase = Constants.manifest2?.extra?.expoClient?.extra?.EXPO_PUBLIC_API_BASE_URL;

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || "";
  const host = hostUri.split(":")[0];
  const hostBased = host ? `http://${host}:3001/api` : "";

  return unique(
    [envBase, configBase, manifestBase, resolveFallbackBaseURL(), hostBased, "http://localhost:3001/api"].map(cleanBaseURL),
  );
}

const BASE_URL_CANDIDATES = buildBaseURLCandidates();
let baseURLIndex = 0;

const baseURL = BASE_URL_CANDIDATES[baseURLIndex] || cleanBaseURL(resolveFallbackBaseURL());

function isRetryableNetworkError(error) {
  if (!error) return false;
  if (error.code === "ECONNABORTED") return true;
  if (!error.response) return true;
  return false;
}

function getNextBaseURL() {
  if (BASE_URL_CANDIDATES.length <= 1) return null;
  if (baseURLIndex + 1 >= BASE_URL_CANDIDATES.length) return null;
  baseURLIndex += 1;
  return BASE_URL_CANDIDATES[baseURLIndex];
}

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (!config || config.__retryWithNextBaseURL) {
      return Promise.reject(error);
    }

    if (!isRetryableNetworkError(error)) {
      return Promise.reject(error);
    }

    const nextBaseURL = getNextBaseURL();
    if (!nextBaseURL) {
      return Promise.reject(error);
    }

    config.__retryWithNextBaseURL = true;
    config.baseURL = nextBaseURL;

    return api.request(config);
  },
);
