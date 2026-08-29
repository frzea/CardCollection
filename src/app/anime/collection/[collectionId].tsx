import { apiDELETE, apiPATCH, apiPOST } from "@/api/events";
import { CardModal } from "@/components/card-modal/card-modal";
import { Card } from "@/components/card/card";
import { createStyles } from "@/design-system/styles/collections";
import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { Cards, UserCard } from "@/types/type";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionPage() {
  const { id, collectionId, name } = useLocalSearchParams<{
    id: string;
    collectionId: string;
    name: string;
  }>();
  const { theme, colorScheme } = useTheme();
  const style = createStyles(theme);
  const { data } = useFetch<Cards[]>(`cards?collectionId=${collectionId}`, []);
  const {
    data: userCards,
    setData: setUserCard,
    refetch: refreshUserCards,
  } = useFetch<UserCard[]>(`userCards?userId=1&collectionId=${collectionId}`, []);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const userCardByCardId = new Map(userCards.map((item) => [item.cardId, item]));
  const selectedCard = data.find((c) => c.cardId === selectedCardId) ?? null;
  const selectedCount = selectedCardId ? (userCardByCardId.get(selectedCardId)?.count ?? 0) : 0;

  async function handleAdd() {
    if (!selectedCardId) return;
    const existing = userCardByCardId.get(selectedCardId);
    try {
      if (!existing) {
        const created = await apiPOST<UserCard>("userCards", {
          userId: 1,
          collectionId: Number(collectionId),
          cardId: selectedCardId,
          count: 1,
        });
        setUserCard((prev) => [...prev, created]);
      } else {
        const updated = await apiPATCH<UserCard>(`userCards/${existing.id}`, {
          count: existing.count + 1,
        });
        setUserCard((prev) => prev.map((uc) => (uc.id === updated.id ? updated : uc)));
      }
    } catch {
      refreshUserCards();
    }
  }

  async function handleRemove() {
    if (!selectedCardId) return;
    const existing = userCardByCardId.get(selectedCardId);
    if (!existing) return;
    try {
      if (existing.count <= 1) {
        await apiDELETE(`userCards/${existing.id}`);
        setUserCard((prev) => prev.filter((uc) => uc.id !== existing.id));
      } else {
        const updated = await apiPATCH<UserCard>(`userCards/${existing.id}`, {
          count: existing.count - 1,
        });
        setUserCard((prev) => prev.map((uc) => (uc.id === updated.id ? updated : uc)));
      }
    } catch {
      refreshUserCards();
    }
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
            {data.map((item, index) => (
              <Card
                key={item.cardId}
                id={item.cardId}
                image={item.image}
                numColumn={3}
                owned={userCardByCardId.has(item.cardId)}
                count={userCardByCardId.get(item.cardId)?.count ?? 0}
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
