import { Card } from "@/components/card/card";
import { createStyles } from "@/design-system/styles/collections";
import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { Cards } from "@/types/type";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Modal, Text, TouchableWithoutFeedback, View } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);

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
            <Card
              key={item.cardId}
              id={item.cardId}
              numColumn={3}
              setModalVisible={setModalVisible}
            />
          ))}
        </View>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={style.modalBgContainer}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={style.modal}>
                  <Text>Custom modal</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </>
  );
}
