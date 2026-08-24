import { useTheme } from "@/hooks/useTheme";
import { Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./style";

type CArdProps = {
  id: number;
  numColumn: number;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Card({ id, numColumn, setModalVisible }: CArdProps) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  return (
    <TouchableOpacity
      style={[style.cardWrapper, { width: `${100 / numColumn}%` }]}
      activeOpacity={0.8}
      onPress={() => setModalVisible((prev) => !prev)}
    >
      <View style={style.cardInner}>
        <Text>{id}</Text>
      </View>
    </TouchableOpacity>
  );
}
