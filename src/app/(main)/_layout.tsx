import { Stack } from "expo-router";

export default function ProtectLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#282330" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
