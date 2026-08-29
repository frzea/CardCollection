import { fontSize, fontWeight, radius } from "@/design-system";
import { colors, type Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardWrapper: {
      padding: 4,
      aspectRatio: 3 / 4, // под форму карточки
    },
    cardInner: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    badge: {
      position: "absolute",
      top: 4,
      right: 4,
      minWidth: 20,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: colors.white,
      fontSize: fontSize.sall,
      fontWeight: fontWeight.bold,
    },
  });
