import axios from "axios";
import API_BASE_URL from "./apiBaseUrl";

export async function register({ username, email, password, role = "user" }) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
      role,
    });
    return res.data || "Successfully registered!";
  } catch (err) {
    throw err.response?.data?.message || "Registration failed..";
  }
}
