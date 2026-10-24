import { ApiError } from "@/api/api-error";
import { useAddUserCard, useRemoveUserCard, useUploadCards } from "@/api/queries/mutations";
import { useCollectionById, useCollectionCards, useUserCards } from "@/api/queries/queries";
import { CardModal } from "@/components/card-modal/card-modal";
import { Card } from "@/components/card/card";
import { colors } from "@/design-system/index";
import { createStyles } from "@/design-system/styles/collections";
import { useAuth } from "@/hooks/useAuth";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useTheme } from "@/hooks/useTheme";
import { Cards } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { onlineManager } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export { ErrorScreen as ErrorBoundary } from "@/components/error-screen/error-screen";

export default function CollectionPage() {
  const { isAdmin } = useAuth();
  const { collectionId, name } = useLocalSearchParams<{ id: string; collectionId: string; name: string }>();
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const { data: collectionInfo } = useCollectionById(collectionId);
  const { data: collctionCards, isPending, isPaused, error, refetch } = useCollectionCards(collectionId);
  const maxCards = collectionInfo?.cards ?? 0;
  const freeSlots = Math.max(maxCards - (collctionCards ?? []).length, 0);
  const { images, pick, remove, reset } = useImagePicker({ multiple: true, selectionLimit: freeSlots });
  const { data: userCards = [] } = useUserCards();
  const addCard = useAddUserCard();
  const removeCard = useRemoveUserCard();
  const uploadCards = useUploadCards(collectionId);
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

  const userCardByCardId = useMemo(
    () => new Map(userCards.filter((item) => item.collectionId === collectionId).map((item) => [item.cardId, item])),
    [userCards, collectionId],
  );
  const selectedCard = (collctionCards ?? []).find((c) => c.id === selectedCardId) ?? null;
  const selectedCount = selectedCardId ? (userCardByCardId.get(selectedCardId)?.count ?? 0) : 0;

  // защита от двойного нажатия
  const isLock = addCard.isPending || removeCard.isPending;

  const canPick = !uploadCards.isPending && !!collectionInfo && freeSlots - images.length > 0;

  function handleAdd() {
    if (!selectedCardId || isLock) return;
    addCard.mutate({ existing: userCardByCardId.get(selectedCardId), cardId: selectedCardId, collectionId });
  }

  function handleRemove() {
    if (!selectedCardId || isLock) return;
    const existing = userCardByCardId.get(selectedCardId);
    if (existing) removeCard.mutate(existing);
  }

  function uploadingCards() {
    uploadCards.mutate(
      { urls: images.slice(0, freeSlots), onUploaded: remove },
      {
        onError: (error) => {
          if (error instanceof ApiError && error.status === 409) reset();
        },
      },
    );
  }

  const renderCards = ({ item }: { item: Cards }) => {
    return (
      <Card
        id={item.id}
        image={item.image}
        numColumn={3}
        owned={userCardByCardId.has(item.id)}
        count={userCardByCardId.get(item.id)?.count ?? 0}
        onPress={setSelectedCardId}
      />
    );
  };

  const adminPanel = (
    <View>
      <TouchableOpacity style={style.button} activeOpacity={0.8} disabled={!canPick} onPress={pick}>
        <Text>{collectionInfo ? `Select Img (${images.length}/${freeSlots})` : "Select Img"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.button} disabled={images.length === 0 || uploadCards.isPending} activeOpacity={0.8} onPress={uploadingCards}>
        <Text>{uploadCards.isPending ? `Uploading... осталось ${images.length}` : `Add Img (${images.length})`}</Text>
      </TouchableOpacity>
    </View>
  );

  const emptyData = (
    <View>
      <Text>There are no cards in the collection yet</Text>
    </View>
  );

  const header = (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Screen
        options={{
          title: `Collection: ${name}`,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.searchInput.background,
          },
          headerTintColor: theme.text,
        }}
      />
    </>
  );

  if (collctionCards) {
    return (
      <>
        {header}
        <CardModal
          visible={selectedCardId !== null}
          card={selectedCard}
          count={selectedCount}
          disabled={isLock}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onClose={() => setSelectedCardId(null)}
        />
        <SafeAreaView style={style.searcView} edges={["bottom"]}>
          <FlatList
            data={collctionCards}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCards}
            numColumns={3}
            ListHeaderComponent={isAdmin ? adminPanel : null}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyData}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </SafeAreaView>
      </>
    );
  }

  if (isPending && isPaused) {
    return (
      <>
        {header}
        <View style={style.center}>
          <Feather name="wifi-off" size={48} color={theme.iconColor} />
          <Text style={style.errorText}>No connection. Data will load automatically.</Text>
        </View>
      </>
    );
  }

  if (isPending) {
    return (
      <>
        {header}
        <View style={style.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      {header}
      <View style={style.center}>
        <Text style={style.errorText}>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()} style={style.retryBtn}>
          <Text style={style.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
