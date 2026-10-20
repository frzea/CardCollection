import { colors } from "@/design-system/theme/colors";
import Feather from "@expo/vector-icons/Feather";
import { ErrorBoundaryProps, useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { createStyles } from "./styles";

// Не используем useTheme(): в корневом _layout провайдеров над этим экраном нет
export function ErrorScreen({ error, retry }: ErrorBoundaryProps) {
  const theme = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const style = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  console.log("ErrorBoundary:", error);

  // Если назад идти некуда (упал весь layout), просто пробуем отрисовать заново
  function goBack() {
    if (router.canGoBack()) router.back();
    else retry();
  }

  return (
    <View style={style.container}>
      <Feather name="alert-triangle" size={64} color={colors.warning} />
      <Text style={style.title}>Something went wrong</Text>
      <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={goBack}>
        <Text style={style.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
