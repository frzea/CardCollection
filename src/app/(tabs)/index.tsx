import { CardTitleList } from "@/components/card-title-list/card-title-list";
import { SearchInput } from "@/components/ui/search-input/search-input";
import { createStyles } from "@/design-system/styles/search-page";
import { useTheme } from "@/hooks/useTheme";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPage() {
  const { theme } = useTheme();
  const style = createStyles(theme);

  return (
    <SafeAreaView style={style.searcView}>
      <View style={style.content}>
        <Text style={style.text}>Review</Text>
        <SearchInput />
        <CardTitleList />
      </View>
    </SafeAreaView>
  );
}
