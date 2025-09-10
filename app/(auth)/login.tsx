import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { API_BASE, APP_SCHEME } from "@lib/config";
import { saveToken, getToken } from "@lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  // On mount, check if token already exists
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        router.replace("/(tabs)");
      } else {
        setChecking(false);
      }
    })();
  }, [router]);

  // Listen for deep link redirect
  useEffect(() => {
    const sub = Linking.addEventListener("url", async ({ url }) => {
      const { queryParams, path } = Linking.parse(url);
      if (path === "auth" && queryParams?.token) {
        await saveToken(String(queryParams.token));
        router.replace("/(tabs)");
      }
    });
    return () => sub.remove();
  }, [router]);

  const startLogin = async () => {
    try {
      setBusy(true);
      const redirectUri = `${APP_SCHEME}://auth`;
      const authUrl = `${API_BASE}/auth/login?redirect=${encodeURIComponent(redirectUri)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const token = parsed.queryParams?.token as string | undefined;
        if (token) {
          await saveToken(token);
          router.replace("/(tabs)");
        }
      }
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-6">Sign in to continue</Text>
      <TouchableOpacity
        onPress={startLogin}
        disabled={busy}
        className="rounded-xl bg-green-500 px-6 py-3"
      >
        <Text className="text-white font-semibold">
          {busy ? "Opening..." : "Login with Spotify"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
