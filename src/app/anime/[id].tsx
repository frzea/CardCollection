import { SeasonsList } from "@/components/seasons/seasons";
import { createStyles } from "@/design-system/styles/seasons";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimeDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { theme, colorScheme } = useTheme();
  const style = createStyles(theme);

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Screen
        options={{
          title: name,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.headBackground,
          },
          headerTintColor: theme.text,
        }}
      />
      <SafeAreaView style={style.searcView} edges={["bottom"]}>
        <View style={style.content}>
          <SeasonsList id={id} />
        </View>
      </SafeAreaView>
    </>
  );
}
