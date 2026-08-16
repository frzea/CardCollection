import { useAnimeSeasons } from "@/hooks/useAnimeSeasons";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function AnimeDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const seasons = useAnimeSeasons(id);

  return (
    <>
      <Stack.Screen options={{ title: name, headerTitleAlign: "center" }} />
      <View>
        <Text>{id}</Text>
      </View>
    </>
  );
}
