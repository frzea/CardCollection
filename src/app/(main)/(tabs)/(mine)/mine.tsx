import { MyManhwasList } from "@/components/my-manhwas-list/my-manhwas-list";
import { createStyles } from "@/design-system/styles/my-collections";
import { useStyles } from "@/hooks/useStyles";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Mine() {
  const style = useStyles(createStyles);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={style.searcView}>
        <View style={style.content}>
          <Text style={style.text}>My collections</Text>
          <MyManhwasList />
        </View>
      </SafeAreaView>
    </>
  );
}
