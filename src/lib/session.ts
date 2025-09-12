import { clearToken } from "../lib/auth";
import { router } from "expo-router";

/**
 * Logs out the user by clearing tokens and redirecting to /login.
 */
export async function logout() {
  await clearToken();
  router.replace("/(auth)/login");
}