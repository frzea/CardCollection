import { fontSize } from "@/design-system/index";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { createStyles } from "./styles";

export function SearchInput() {
  const { theme } = useTheme();
  const [serchInput, setSerchInput] = useState("");
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.searchInput.background },
      ]}
    >
      <Feather
        name="search"
        size={fontSize.lg}
        color={theme.iconColor}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: theme.searchInput.text }]}
        value={serchInput}
        onChangeText={setSerchInput}
        placeholder="titles, manga, anime"
        placeholderTextColor={theme.iconColor}
        keyboardType="default"
      />
    </View>
  );
}
