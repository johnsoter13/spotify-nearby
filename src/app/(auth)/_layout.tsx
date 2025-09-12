import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for login/signup screens
        animation: "slide_from_right", // Optional: nicer transition
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: true, title: 'Login' }} />
    </Stack>
  );
}