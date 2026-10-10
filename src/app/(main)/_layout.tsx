import { useAuth } from "@/hooks/useAuth";
import { Stack } from "expo-router";

export default function ProtectLayout() {
  const { isAdmin } = useAuth();
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#282330" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="manhwa/new-manhwa" />
        <Stack.Screen name="manhwa/new-collections" />
      </Stack.Protected>
    </Stack>
  );
}
