import { apiFetch } from "@/api/client";
import { useTheme } from "@/hooks/useTheme";
import { TitleCardItem } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { createStyles } from "./styles";

export function ManhwaTitle({ id }: { id: number }) {
  const { theme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { data } = useQuery({ queryKey: ["anime", id], queryFn: () => apiFetch<TitleCardItem>(`anime/${id}`) });

  return (
    <>
      <View style={style.container}>
        <Image source={{ uri: data?.coverImage.large }} style={style.backgroundImage} resizeMode="cover" />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={style.gradientOverlay} />
        <Text style={style.imageBgText}>{data?.title.english}</Text>
      </View>
      <Text style={style.titleText}>Collections</Text>
    </>
  );
}
