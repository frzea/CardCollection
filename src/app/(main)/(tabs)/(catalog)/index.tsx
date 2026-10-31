import { CardTitleList } from "@/components/card-title-list/card-title-list";
import { SearchInput } from "@/components/ui/search-input/search-input";
import { createStyles } from "@/design-system/styles/search-page";
import { useAuth } from "@/hooks/useAuth";
import { useStyles } from "@/hooks/useStyles";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Catalog() {
  const { isAdmin } = useAuth();
  const style = useStyles(createStyles);
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={style.searcView}>
        <View style={style.content}>
          <Text style={style.text}>Review</Text>
          <SearchInput value={query} onChengeValue={setQuery} />
          {isAdmin && (
            <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={() => router.push({ pathname: "/manhwa/new-manhwa" })}>
              <Text>Create new</Text>
            </TouchableOpacity>
          )}
          <CardTitleList query={query} />
        </View>
      </SafeAreaView>
    </>
  );
}
