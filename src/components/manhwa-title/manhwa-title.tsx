import { resolveImageUrl } from "@/api/client";
import { useManhwa } from "@/api/queries/queries";
import { colors } from "@/design-system";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

export function ManhwaTitle({ id }: { id: string }) {
  const { isAdmin } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { data, error, isLoading } = useManhwa(id);

  if (isLoading) return <ActivityIndicator size="large" color={colors.primary} />;

  if (error || !data) return null;

  return (
    <>
      <View style={style.container}>
        {data.coverImage.large ? (
          <Image source={{ uri: resolveImageUrl(data.coverImage.large) }} style={style.backgroundImage} contentFit="cover" transition={200} />
        ) : (
          <View style={[StyleSheet.absoluteFill, style.coverPlaceholder]}>
            <Feather name="layers" size={32} color={theme.iconColor} />
          </View>
        )}
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={style.gradientOverlay} />
        <Text style={style.imageBgText}>{data.title.english || data.title.romaji}</Text>
      </View>
      <View style={style.siteBar}>
        <Text style={style.titleText}>Collections</Text>
        {isAdmin && (
          <TouchableOpacity
            style={style.button}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: "/manhwa/new-collections", params: { id: id } })}
          >
            <Text>Create new</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
