import { Stack, useTheme } from "expo-router";

export default function TabsStack() {
  const theme = useTheme();
  return <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background } }} />;
}
