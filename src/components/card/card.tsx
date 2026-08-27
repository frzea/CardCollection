import { resolveImageUrl } from "@/api/client";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { createStyles } from "./style";

type CArdProps = {
  id: number;
  image: string;
  numColumn: number;
  owned: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Card({
  id,
  image,
  numColumn,
  owned,
  setModalVisible,
}: CArdProps) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  return (
    <TouchableOpacity
      style={[style.cardWrapper, { width: `${100 / numColumn}%` }]}
      activeOpacity={0.8}
      onPress={() => setModalVisible((prev) => !prev)}
    >
      <View style={style.cardInner}>
        <Image
          source={{ uri: resolveImageUrl(image) }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {!owned && <View style={style.overlay} />}
      </View>
    </TouchableOpacity>
  );
}
