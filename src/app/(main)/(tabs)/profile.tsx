import { spacing } from "@/design-system/index";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { logOut } = useAuth();

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
      <TouchableOpacity style={stales.button} activeOpacity={0.8} onPress={logOut}>
        <Text>Exit</Text>
      </TouchableOpacity>
    </View>
  );
}

const stales = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: spacing.xxl,
    width: spacing.xl * 6,
    backgroundColor: "#bebaba",
    alignSelf: "flex-end",
  },
});
