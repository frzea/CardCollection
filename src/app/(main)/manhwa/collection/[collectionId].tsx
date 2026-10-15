import { ApiError } from "@/api/api-error";
import { useAddUserCard, useRemoveUserCard, useUploadCards } from "@/api/queries/mutations";
import { useCollectionById, useCollectionCards, useUserCards } from "@/api/queries/queries";
import { CardModal } from "@/components/card-modal/card-modal";
import { Card } from "@/components/card/card";
import { createStyles } from "@/design-system/styles/collections";
import { useAuth } from "@/hooks/useAuth";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useTheme } from "@/hooks/useTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionPage() {
  const { user, isAdmin } = useAuth();
  const { collectionId, name } = useLocalSearchParams<{ id: string; collectionId: string; name: string }>();
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const { data: collectionInfo } = useCollectionById(collectionId);
  const { data: collctionCards = [] } = useCollectionCards(collectionId);
  const maxCards = Number(collectionInfo?.cards ?? 0);
  const freeSlots = Math.max(maxCards - collctionCards.length, 0);
  const { images, pick, remove, reset } = useImagePicker({ multiple: true, selectionLimit: freeSlots });
  const { data: userCards = [] } = useUserCards(user?.id);
  const addCard = useAddUserCard(user?.id);
  const removeCard = useRemoveUserCard(user?.id);
  const uploadCards = useUploadCards(collectionId);

  const userCardByCardId = useMemo(
    () => new Map(userCards.filter((item) => item.collectionId == collectionId).map((item) => [item.cardId, item])),
    [userCards, collectionId],
  );
  const selectedCard = collctionCards.find((c) => c.id === selectedCardId) ?? null;
  const selectedCount = selectedCardId ? (userCardByCardId.get(selectedCardId)?.count ?? 0) : 0;

  // защита от двойного нажатия
  const isLock = addCard.isPending || removeCard.isPending;

  const canPick = !!collectionInfo && freeSlots - images.length > 0;

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
          if (error instanceof ApiError && error.status === 400) reset();
        },
      },
    );
  }

  return (
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
      <ScrollView>
        {isAdmin && (
          <View>
            <TouchableOpacity style={style.button} activeOpacity={0.8} disabled={!canPick} onPress={pick}>
              <Text>Select Img</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.button}
              disabled={images.length === 0 || uploadCards.isPending}
              activeOpacity={0.8}
              onPress={uploadingCards}
            >
              <Text>{uploadCards.isPending ? `Uploading... осталось ${images.length}` : `Add Img (${images.length})`}</Text>
            </TouchableOpacity>
          </View>
        )}
        <SafeAreaView style={style.searcView} edges={["bottom"]}>
          <View style={style.grid}>
            {collctionCards.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                image={item.image}
                numColumn={3}
                owned={userCardByCardId.has(item.id)}
                count={userCardByCardId.get(item.id)?.count ?? 0}
                onPress={setSelectedCardId}
              />
            ))}
          </View>
          <CardModal
            visible={selectedCardId !== null}
            card={selectedCard}
            count={selectedCount}
            disabled={isLock}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onClose={() => setSelectedCardId(null)}
          />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
