import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/index.css"
import { Stack } from 'expo-router';

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    </QueryClientProvider>
  );
}