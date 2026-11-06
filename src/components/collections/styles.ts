import { fontSize, radius } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flatList: {
      gap: 12,
    },
    card: {
      flexDirection: "row",
      backgroundColor: theme.navBackground,
      overflow: "hidden",
      height: 220,
      padding: 10,
      borderRadius: radius.sm,
    },
    cover: {
      height: "100%",
      aspectRatio: 2 / 3,
      borderRadius: radius.xs,
      overflow: "hidden",
    },
    coverPlaceholder: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: theme.iconColor,
      alignItems: "center",
      justifyContent: "center",
    },
    info: {
      flex: 1,
      justifyContent: "flex-start",
      paddingHorizontal: 12,
    },
    title: {
      fontSize: fontSize.base,
      fontWeight: "600",
      color: theme.text,
    },
  });
