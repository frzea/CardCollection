import { useTheme } from "@/hooks/useTheme";
import { Switch, Text, View } from "react-native";

export default function ProfilePage() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View>
      <Text style={{ color: theme.text }}> Profile page</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDark}
      />
    </View>
  );
}
