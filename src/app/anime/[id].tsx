import { CollectionsList } from "@/components/collections/collections";
import { createStyles } from "@/design-system/styles/collections";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimeDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);

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
