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
      {/* If you add more auth screens later: */}
      {/* <Stack.Screen name="signup" /> */}
      {/* <Stack.Screen name="forgot-password" /> */}
    </Stack>
  );
}