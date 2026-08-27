import { colors } from "@/design-system/index";
import { useTheme } from "@/hooks/useTheme";
import { TitleCardItem } from "@/types/type";
import { useRouter } from "expo-router";

import { useFetch } from "@/hooks/useAPI";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "./styles";

export function CardTitleList({ query }: { query: string }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, loading, error, refetch } = useFetch<TitleCardItem[]>(
    "anime",
    [],
  );

  const filterData = data.filter((item) => {
    const title = (
      item.title.english ||
      item.title.romaji ||
      ""
    ).toLocaleLowerCase();
    return title.includes(query.trim().toLocaleLowerCase());
  });

  const renderCard = ({ item }: { item: TitleCardItem }) => (
    <TouchableOpacity
      style={style.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: `/anime/[id]`,
          params: {
            id: item.id,
            name: item.title.english || item.title.romaji,
          },
        })
      }
    >
      <Image source={{ uri: item.coverImage.large }} style={style.cover} />
      <View style={style.info}>
        <Text style={style.title} numberOfLines={2}>
          {item.title.english || item.title.romaji}
        </Text>
        <Text style={style.meta}>
          {item.episodes ? `${item.episodes} эп.` : ""} ⭐{" "}
          {item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A"}
        </Text>
        <Text style={style.genres} numberOfLines={1}>
          {item.genres.slice(0, 3).join(", ")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading || error)
    return (
      <View
        style={{
          width: "100%",
          height: "80%",
        }}
      >
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
      </View>
    );

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCard}
      numColumns={2}
      columnWrapperStyle={style.row}
      contentContainerStyle={[
        style.list,
        { paddingBottom: insets.bottom + 70 },
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}
