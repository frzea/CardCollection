import { useAuth } from "@/hooks/useAuth";
import { Stack, useTheme } from "expo-router";

export default function ProtectLayout() {
  const { isAdmin } = useAuth();
  const theme = useTheme();
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="manhwa/new-manhwa" />
        <Stack.Screen name="manhwa/new-collections" />
      </Stack.Protected>
    </Stack>
  );
}
