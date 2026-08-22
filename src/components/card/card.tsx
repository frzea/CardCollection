import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";
import { createStyles } from "./style";

export function Card({ id, numColumn }: { id: number; numColumn: number }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  return (
    <View style={[style.cardWrapper, { width: `${100 / numColumn}%` }]}>
      <View style={style.cardInner} />
    </View>
  );
}
