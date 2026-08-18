import { useAnimeList } from "@/hooks/useAnimeList";
import { useTheme } from "@/hooks/useTheme";
import { Seasons } from "@/types/type";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function SeasonsList({ id }: { id: string }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const { anime, loading, error, refetch } = useAnimeList();

  const seasons = anime.find((item) => item.id === id)?.seasons;

  const renderSeasons = ({ item }: { item: Seasons }) => (
    <TouchableOpacity style={style.card} activeOpacity={0.8}>
      <Image
        source={{ uri: item.image }}
        style={style.cover}
        resizeMode="contain"
      />
      <View style={style.info}>
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={seasons}
      keyExtractor={(item) => String(item.seasonId)}
      renderItem={renderSeasons}
      contentContainerStyle={style.flatList}
    />
  );
}
