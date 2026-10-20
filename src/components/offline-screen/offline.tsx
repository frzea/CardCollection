import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function OfflineScreen() {
  const { theme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { retry } = useAuth();

  return (
    <View style={style.container}>
      <Feather name="wifi-off" size={64} color={theme.iconColor} />
      <Text style={style.title}>Internet connection lost</Text>
      <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={retry}>
        <Text style={style.buttonText}>Reconnect</Text>
      </TouchableOpacity>
    </View>
  );
}
