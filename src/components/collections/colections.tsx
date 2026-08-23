import { ManhwaTitle } from "@/components/manhwa-title/manhwa-title";
import { colors } from "@/design-system/index";
import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { Collections } from "@/types/type";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyles } from "./styles";

export function CollectionsList({ id }: { id: number }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const { data, loading, error, refetch } =
    useFetch<Collections[]>("collections");
  const router = useRouter();

  const collections = data.filter((item) => item.animeId === id);

  const renderSeasons = ({ item }: { item: Collections }) => (
    <TouchableOpacity
      style={style.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/anime/collection/[collectionId]",
          params: { id: id, collectionId: item.collectionId, name: item.title },
        })
      }
    >
      <Image /*source={{ uri: item.image }}*/ style={style.cover} />
      <View style={style.info}>
        <Text style={style.title}>{item.title}</Text>
        <Text style={style.title}>Кол. карточек - 0/{item.cards}</Text>
        <Text style={style.title}>{item.collectionId}</Text>
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
          data={collections}
          keyExtractor={(item) => String(item.collectionId)}
          renderItem={renderSeasons}
          contentContainerStyle={style.flatList}
          decelerationRate={0}
          ListHeaderComponent={<ManhwaTitle id={id} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
}
