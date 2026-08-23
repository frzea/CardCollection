import { CollectionsList } from "@/components/collections/colections";
import { createStyles } from "@/design-system/styles/seasons";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimeDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const { theme, colorScheme } = useTheme();
  const style = createStyles(theme);

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Screen
        options={{
          title: `Collection: ${name}`,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.searchInput.background,
          },
          headerTintColor: theme.text,
        }}
      />
      <SafeAreaView style={style.searcView} edges={["bottom"]}>
        <View style={style.content}>
          <CollectionsList id={Number(id)} />
        </View>
      </SafeAreaView>
    </>
  );
}
