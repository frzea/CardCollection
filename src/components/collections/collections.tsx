import { resolveImageUrl } from "@/api/client";
import { useCollection, useUserCards } from "@/api/queries/queries";
import { ManhwaTitle } from "@/components/manhwa-title/manhwa-title";
import { colors } from "@/design-system/index";
import { useTheme } from "@/hooks/useTheme";
import { Collections } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { onlineManager } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function CollectionsList({ id }: { id: string }) {
  const { theme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const { data: collectionData, isPending, isPaused, error, refetch } = useCollection(id);
  const { data: userCards = [] } = useUserCards();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    if (onlineManager.isOnline()) {
      Alert.alert("Нет сети", "Проверьте подключение к интернету");
      return; // рефреш не делаем
    }

    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const ownedCount = useMemo(
    () => new Map((collectionData ?? []).map((item) => [item.id, userCards.filter((uc) => uc.collectionId === item.id).length])),
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
            pathname: "/manhwa/collection/[collectionId]",
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
          <Text style={style.title}>{item.releaseDate}</Text>
          <Text style={style.title}>
            Кол. карточек - {cardCount}/{item.cards}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (collectionData) {
    return (
      <FlatList
        data={collectionData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSeasons}
        contentContainerStyle={style.flatList}
        decelerationRate={0}
        ListHeaderComponent={<ManhwaTitle id={id} />}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    );
  }

  if (isPending && isPaused) {
    return (
      <View style={style.center}>
        <Feather name="wifi-off" size={48} color={theme.iconColor} />
        <Text style={style.errorText}>No connection. Data will load automatically.</Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={style.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={style.center}>
      <Text style={style.errorText}>Error: {error.message}</Text>
      <TouchableOpacity onPress={() => refetch()} style={style.retryBtn}>
        <Text style={style.retryText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
