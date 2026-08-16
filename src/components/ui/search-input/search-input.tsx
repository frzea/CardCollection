import { fontSize } from "@/design-system/index";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { TextInput, View } from "react-native";
import { createStyles } from "./styles";

type Props = {
  value: string;
  onChengeValue: (text: string) => void;
};

export function SearchInput({ value, onChengeValue }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={fontSize.lg}
        color={theme.iconColor}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChengeValue}
        placeholder="titles, manga, anime"
        placeholderTextColor={theme.iconColor}
        keyboardType="default"
      />
    </View>
  );
}
