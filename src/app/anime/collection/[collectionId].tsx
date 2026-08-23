import { Card } from "@/components/card/card";
import { createStyles } from "@/design-system/styles/seasons";
import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { Cards } from "@/types/type";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionPage() {
  const { id, collectionId, name } = useLocalSearchParams<{
    id: string;
    collectionId: string;
    name: string;
  }>();
  const { theme, colorScheme } = useTheme();
  const style = createStyles(theme);
  const { data, loading, error, refetch } = useFetch<Cards[]>("cards");

  const cards = data.filter(
    (item) => String(item.collectionId) === collectionId,
  );

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
      <SafeAreaView style={style.searcView} edges={["bottom"]}>
        <View style={style.grid}>
          {cards.map((item, index) => (
            <Card key={index} id={index} numColumn={3} />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
}
