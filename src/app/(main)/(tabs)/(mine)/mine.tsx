import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Mine() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Text>Mine</Text>
      </View>
    </>
  );
}
