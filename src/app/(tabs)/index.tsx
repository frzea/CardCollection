import { createStyles } from "@/design-system/index";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPage() {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const [serchInput, setSerchInput] = useState("");
  return (
    <SafeAreaView style={style.searcView}>
      <View style={style.content}>
        <Text style={style.text}>Review</Text>
        <View style={[styles.container, { backgroundColor: theme.tabBar }]}>
          <Feather
            name="search"
            size={18}
            color={theme.iconColor}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={serchInput}
            onChangeText={setSerchInput}
            placeholder="titles, manga, anime"
            placeholderTextColor={theme.iconColor}
            keyboardType="default"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0, // убирает лишний вертикальный паддинг на Android
  },
});
