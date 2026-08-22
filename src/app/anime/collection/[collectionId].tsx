import { Card } from "@/components/card/card";
import { createStyles } from "@/design-system/styles/seasons";
import { useAnimeList } from "@/hooks/useAnimeList";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionPage() {
  const { id, collectionId, name } = useLocalSearchParams<{
    id: string;
    collectionId: string;
    name: string;
  }>();
  const { theme, colorScheme } = useTheme();
  const style = createStyles(theme);
  const { anime, loading, error, refetch } = useAnimeList();

  const seasons = anime.find((item) => item.id === id)?.seasons;
  const totalCards = seasons?.find(
    (item) => item.seasonId === Number(collectionId),
  )?.episodes;

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
        <View style={style.grid}>
          {Array.from({ length: Number(totalCards) }).map((_, index) => (
            <Card key={index} id={index} numColumn={3} />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
}
