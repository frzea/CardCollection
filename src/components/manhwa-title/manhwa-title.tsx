import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { TitleCardItem } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import { createStyles } from "./styles";

export function ManhwaTitle({ id }: { id: number }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const { data } = useFetch<TitleCardItem | null>(`anime/${id}`, null);

  return (
    <>
      <View style={style.container}>
        <Image
          source={{ uri: data?.coverImage.large }}
          style={style.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={style.gradientOverlay}
        />
        <Text style={style.imageBgText}>{data?.title.english}</Text>
      </View>
      <Text style={style.titleText}>Collections</Text>
    </>
  );
}
