import { ManhwaTitle } from "@/components/manhwa-title/manhwa-title";
import { colors } from "@/design-system/index";
import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { Collections, UserCard } from "@/types/type";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function CollectionsList({ id }: { id: number }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const router = useRouter();
  const { data, loading, error, refetch } = useFetch<Collections[]>(
    `collections?animeId=${id}`,
    [],
  );
  const { data: userCards, refetch: refetchUserCard } = useFetch<UserCard[]>(
    "userCards?userId=1",
    [],
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchUserCard();
    }, []),
  );

  const renderSeasons = ({ item }: { item: Collections }) => {
    const ownedCount = userCards.filter((uc) => uc.collectionId === Number(item.id)).length;

    return (
      <TouchableOpacity
        style={style.card}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/anime/collection/[collectionId]",
            params: { id: id, collectionId: item.id, name: item.title },
          })
        }
      >
        <Image /*source={{ uri: item.image }}*/ style={style.cover} />
        <View style={style.info}>
          <Text style={style.title}>{item.title}</Text>
          <Text style={style.title}>
            Кол. карточек - {ownedCount}/{item.cards}
          </Text>
          <Text style={style.title}>{item.collectionId}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
          data={data}
          keyExtractor={(item) => String(item.id)}
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
