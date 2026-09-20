import { resolveImageUrl } from "@/api/client";
import { useManhwa } from "@/api/queries/queries";
import { colors } from "@/design-system";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function ManhwaTitle({ id }: { id: string }) {
  const { theme } = useTheme();
  const router = useRouter();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { data, error, isLoading } = useManhwa(id);

  if (isLoading) return <ActivityIndicator size="large" color={colors.primary} />;

  if (error || !data) return null;

  return (
    <>
      <View style={style.container}>
        <Image source={{ uri: resolveImageUrl(data.coverImage.large) }} style={style.backgroundImage} resizeMode="cover" />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={style.gradientOverlay} />
        <Text style={style.imageBgText}>{data?.title.english}</Text>
      </View>
      <View style={style.siteBar}>
        <Text style={style.titleText}>Collections</Text>
        <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={() => router.push({ pathname: "/anime/new-collections" })}>
          <Text>Create new</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
