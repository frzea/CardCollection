import { resolveImageUrl } from "@/api/client";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./style";

type CardProps = {
  id: number;
  image: string;
  numColumn: number;
  owned: boolean;
  count: number;
  onPress: (id: number) => void;
};

export function Card({ id, image, numColumn, owned, count, onPress }: CardProps) {
  const { theme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  return (
    <TouchableOpacity style={[style.cardWrapper, { width: `${100 / numColumn}%` }]} activeOpacity={0.8} onPress={() => onPress(id)}>
      <View style={style.cardInner}>
        <Image source={{ uri: resolveImageUrl(image) }} style={StyleSheet.absoluteFill} contentFit="cover" />
        {!owned && <View style={style.overlay} />}
        {count > 1 && (
          <View style={style.badge}>
            <Text style={style.badgeText}>x{count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
