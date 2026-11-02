import { resolveImageUrl } from "@/api/client";
import { useMyManhwa } from "@/api/queries/queries";
import { useRefresh } from "@/hooks/useRefresh";
import { useStyles } from "@/hooks/useStyles";
import { MyManhwa } from "@/types/type";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "./styles";

export function MyManhwasList() {
  const style = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, isPending, isPaused, error, refetch } = useMyManhwa();
  const { isRefreshing, onRefresh } = useRefresh(refetch);

  const renderCard = ({ item }: { item: MyManhwa }) => (
    <TouchableOpacity
      style={style.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: `/manhwa/[id]`,
          params: {
            id: item.id,
            name: item.title.english || item.title.romaji,
          },
        })
      }
    >
      <Image source={{ uri: resolveImageUrl(item.coverImage.large) }} style={style.cover} transition={200} />
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
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    );
  }
}
