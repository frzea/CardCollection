import { SeasonsList } from "@/components/seasons/seasons";
import { createStyles } from "@/design-system/styles/seasons";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimeDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { theme } = useTheme();
  const style = createStyles(theme);

  return (
    <>
      <Stack.Screen options={{ title: name, headerTitleAlign: "center" }} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={style.content}>
          <SeasonsList id={id} />
        </View>
      </SafeAreaView>
    </>
  );
}
