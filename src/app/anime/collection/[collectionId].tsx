import { apiDELETE, apiPATCH, apiPOST } from "@/api/events";
import { useCollectionCards, useUserCards } from "@/api/queries/queries";
import { CardModal } from "@/components/card-modal/card-modal";
import { Card } from "@/components/card/card";
import { createStyles } from "@/design-system/styles/collections";
import useAsyncStorage from "@/hooks/useAsuncStorage";
import { useTheme } from "@/hooks/useTheme";
import { UserAuth, UserCard } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionPage() {
  const { collectionId, name } = useLocalSearchParams<{ id: string; collectionId: string; name: string }>();
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [auth, setAuth, loading] = useAsyncStorage<UserAuth>({
    key: "user-auth",
    initialValue: { userId: 0, roleId: 0 },
  });
  const { data: collctionCards = [] } = useCollectionCards(collectionId);
  const { data: userCards = [] } = useUserCards(String(auth.userId));

  const userCardByCardId = useMemo(
    () => new Map(userCards.filter((item) => item.collectionId == collectionId).map((item) => [item.cardId, item])),
    [userCards, collectionId],
  );
  const selectedCard = collctionCards.find((c) => c.id === selectedCardId) ?? null;
  const selectedCount = selectedCardId ? (userCardByCardId.get(selectedCardId)?.count ?? 0) : 0;

  const addMutations = useMutation({
    mutationFn: (existing?: UserCard) =>
      existing
        ? apiPATCH<UserCard>(`userCards/${existing.id}`, {
            count: existing.count + 1,
          })
        : apiPOST<UserCard>("userCards", {
            userId: String(auth.userId),
            collectionId: collectionId,
            cardId: selectedCardId,
            count: 1,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCards", String(auth.userId)] });
    },
  });

  const removeMutations = useMutation({
    mutationFn: (existing: UserCard) =>
      existing.count <= 1
        ? apiDELETE(`userCards/${existing.id}`)
        : apiPATCH<UserCard>(`userCards/${existing.id}`, {
            count: existing.count - 1,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCards", String(auth.userId)] });
    },
  });

  async function handleAdd() {
    if (!selectedCardId) return;
    const existing = userCardByCardId.get(selectedCardId);
    addMutations.mutate(existing);
  }

  async function handleRemove() {
    if (!selectedCardId) return;
    const existing = userCardByCardId.get(selectedCardId);
    if (!existing) return;
    removeMutations.mutate(existing);
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
        <SafeAreaView style={style.searcView} edges={["bottom"]}>
          <View style={style.grid}>
            {collctionCards.map((item, index) => (
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
            onAdd={handleAdd}
            onRemove={handleRemove}
            onClose={() => setSelectedCardId(null)}
          />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
