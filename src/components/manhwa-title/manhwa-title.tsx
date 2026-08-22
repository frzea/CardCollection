import { useAnimeList } from "@/hooks/useAnimeList";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import { createStyles } from "./styles";

export function ManhwaTitle({ id }: { id: string }) {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const { anime, loading, error, refetch } = useAnimeList();

  const colectTitle = anime.find((item) => item.id === id);

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
