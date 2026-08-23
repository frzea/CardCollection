import { useFetch } from "@/hooks/useAPI";
import { useTheme } from "@/hooks/useTheme";
import { TitleCardItem } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import { createStyles } from "./styles";

export function ManhwaTitle({ id }: { id: number }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const { data, loading, error, refetch } = useFetch<TitleCardItem[]>("anime");

  const colectTitle = data.find((item) => Number(item.id) === id);

  return (
    <>
      <View style={style.container}>
        <Image
          source={{ uri: colectTitle?.coverImage.large }}
          style={style.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={style.gradientOverlay}
        />
        <Text style={style.imageBgText}>{colectTitle?.title.english}</Text>
      </View>
      <Text style={style.titleText}>Collections</Text>
    </>
  );
}
