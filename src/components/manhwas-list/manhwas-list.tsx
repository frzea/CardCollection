import { resolveImageUrl } from "@/api/client";
import { useManhwas } from "@/api/queries/queries";
import { useRefresh } from "@/hooks/useRefresh";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { Manhwa } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { QueryState } from "../query-state/query-state";
import { createStyles } from "./styles";

export function CatalogManhwas({ query }: { query: string }) {
  const { theme } = useTheme();
  const style = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, isPaused, error, refetch } = useManhwas();
  const { isRefreshing, onRefresh } = useRefresh(refetch);

  const filterData = useMemo(
    () =>
      (data ?? []).filter((item) => {
        const title = (item.title.english || item.title.romaji || "").toLocaleLowerCase();
        return title.includes(query.trim().toLocaleLowerCase());
      }),
    [data, query],
  );

  const renderCard = ({ item }: { item: Manhwa }) => (
    <TouchableOpacity style={style.card} activeOpacity={0.8} onPress={() => router.push({ pathname: `/manhwa/[id]`, params: { id: item.id } })}>
      {item.coverImage.large ? (
        <Image source={{ uri: resolveImageUrl(item.coverImage.large) }} style={style.cover} contentFit="cover" transition={200} />
      ) : (
        <View style={style.coverPlaceholder}>
          <Feather name="layers" size={32} color={theme.iconColor} />
        </View>
      )}
      <View style={style.info}>
        <Text style={style.title} numberOfLines={2}>
          {item.title.english || item.title.romaji}
        </Text>
        <Text style={style.meta}>
          {item.episodes ? `${item.episodes} эп.` : ""} ⭐ {item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A"}
        </Text>
        <Text style={style.genres} numberOfLines={1}>
          {item.genres.slice(0, 3).join(", ")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (data) {
    return (
      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={style.row}
        contentContainerStyle={[style.list, { paddingBottom: insets.bottom + 50 }]}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    );
  }

  return <QueryState error={error} isPaused={isPaused} onRetry={refetch} />;
}
