import { resolveImageUrl } from "@/api/client";
import { useCollection, useManhwa, useUserCards } from "@/api/queries/queries";
import { ManhwaTitle } from "@/components/manhwa-title/manhwa-title";
import { OwnedToggle } from "@/components/ui/owned-toggle/owned-toggle";
import { useIsMineTab } from "@/hooks/useIsMineTab";
import { useRefresh } from "@/hooks/useRefresh";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { Collections } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { QueryState } from "../query-state/query-state";
import { createStyles } from "./styles";

export function CollectionsList({ manhwaId }: { manhwaId: string }) {
  const { theme } = useTheme();
  const style = useStyles(createStyles);
  const router = useRouter();
  const isMine = useIsMineTab();
  const [showAll, setShowAll] = useState(false);
  const ownedOnly = isMine && !showAll;
  const { refetch: refetchManhwa } = useManhwa(manhwaId);
  const { data: collectionData, isPaused, error, refetch } = useCollection(manhwaId);
  const { data: userCards = [], isPending: isUserCardsPending, refetch: refetchUserCards } = useUserCards();
  const { isRefreshing, onRefresh } = useRefresh(() => Promise.all([refetch(), refetchUserCards(), refetchManhwa()]));

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
            params: { collectionId: item.id, showAll: String(showAll) },
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
    const visibleCollections = ownedOnly ? collectionData.filter((item) => (ownedCount.get(item.id) ?? 0) > 0) : collectionData;
    return (
      <FlatList
        data={visibleCollections}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSeasons}
        contentContainerStyle={style.flatList}
        decelerationRate={0}
        ListHeaderComponent={
          <>
            <ManhwaTitle id={manhwaId} />
            {isMine && <OwnedToggle showAll={showAll} onToggle={() => setShowAll((prev) => !prev)} />}
          </>
        }
        ListEmptyComponent={
          isUserCardsPending ? null : (
            <Text style={style.title}>{ownedOnly ? "У тебя пока нет карточек из этих коллекций" : "Коллекций пока нет"}</Text>
          )
        }
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    );
  }

  return <QueryState error={error} isPaused={isPaused} onRetry={refetch} />;
}
