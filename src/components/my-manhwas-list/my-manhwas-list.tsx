import { resolveImageUrl } from "@/api/client";
import { useMyManhwa } from "@/api/queries/queries";
import { useRefresh } from "@/hooks/useRefresh";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { MyManhwa } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressBar from "../ui/progress-bar/progress-bar";
import { createStyles } from "./styles";

export function MyManhwasList() {
  const style = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
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
        <Text style={style.cardText}>{`${item.owned} / ${item.total} cards`}</Text>
        <Text style={style.progressText} numberOfLines={2}>
          {"Cards collected"}
        </Text>
        <ProgressBar step={item.owned} total={item.total} />
        <Text style={style.progressText}>{`${Math.round((item.owned / item.total) * 100)}% completed`}</Text>
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
