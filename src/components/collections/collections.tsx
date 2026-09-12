import { apiFetch, resolveImageUrl } from "@/api/client";
import { ManhwaTitle } from "@/components/manhwa-title/manhwa-title";
import { colors } from "@/design-system/index";
import { useTheme } from "@/hooks/useTheme";
import { Collections, UserCard } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function CollectionsList({ id }: { id: number }) {
  const { theme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const {
    data: collectionData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["collections", id],
    queryFn: () => apiFetch<Collections[]>(`collections?animeId=${id}`),
  });
  const { data: userCards = [], refetch: refetchUserCards } = useQuery({
    queryKey: ["userCards", 1],
    queryFn: () => apiFetch<UserCard[]>("userCards?userId=1"),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchUserCards();
    }, [refetch, refetchUserCards]),
  );

  const ownedCount = useMemo(
    () => new Map(collectionData.map((item) => [item.id, userCards.filter((uc) => uc.collectionId === Number(item.id)).length])),
    [collectionData, userCards],
  );

  const renderSeasons = ({ item }: { item: Collections }) => {
    const cardCount = ownedCount.get(item.id);

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
        {item.image ? (
          <Image source={{ uri: resolveImageUrl(item.image) }} style={style.cover} contentFit="cover" />
        ) : (
          <View style={[style.cover, style.coverPlaceholder]}>
            <Feather name="layers" size={32} color={theme.iconColor} />
          </View>
        )}
        <View style={style.info}>
          <Text style={style.title}>{item.title}</Text>
          <Text style={style.title}>
            Кол. карточек - {cardCount}/{item.cards}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isLoading && (
        <View style={style.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {!isLoading && error && (
        <View style={style.center}>
          <Text style={style.errorText}>Error: {error.message}</Text>
          <TouchableOpacity onPress={() => refetch()} style={style.retryBtn}>
            <Text style={style.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isLoading && !error && (
        <FlatList
          data={collectionData}
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
