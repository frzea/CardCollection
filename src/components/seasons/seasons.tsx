import { colors } from "@/design-system/index";
import { useAnimeList } from "@/hooks/useAnimeList";
import { useTheme } from "@/hooks/useTheme";
import { Seasons } from "@/types/type";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyles } from "./styles";

export function SeasonsList({ id }: { id: string }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const { anime, loading, error, refetch } = useAnimeList();

  const seasons = anime.find((item) => item.id === id)?.seasons;

  const renderSeasons = ({ item }: { item: Seasons }) => (
    <TouchableOpacity style={style.card} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={style.cover} />
      <View style={style.info}>
        <Text style={style.title}>{item.title}</Text>
        <Text style={style.title}>Кол. карточек - 0/{item.episodes}</Text>
        <Text style={style.title}>{item.seasonId}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {loading && (
        <View style={style.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {!loading && error && (
        <View style={style.center}>
          <Text style={style.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={refetch} style={style.retryBtn}>
            <Text style={style.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
      {!loading && !error && (
        <FlatList
          data={seasons}
          keyExtractor={(item) => String(item.seasonId)}
          renderItem={renderSeasons}
          contentContainerStyle={style.flatList}
        />
      )}
    </>
  );
}
