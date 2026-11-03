import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      width: "100%",
      flexDirection: "row",
      backgroundColor: theme.background,
      borderRadius: radius.sm,
      marginBottom: spacing.xl,
      overflow: "hidden",
      shadowColor: theme.shadowColor,
      shadowRadius: spacing.xs,
    },
    cover: {
      width: "25%",
      height: 160,
      borderRadius: radius.sm,
      backgroundColor: "#3f3e3e",
    },
    info: {
      flex: 1,
      paddingHorizontal: spacing.sm,
    },
    title: {
      color: theme.text,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      marginBottom: spacing.xs,
    },
    cardText: {
      color: colors.primary,
      fontSize: fontSize.md,
      marginBottom: 20,
    },
    progressText: {
      color: theme.text,
      fontSize: fontSize.md,
      marginBottom: 2,
    },
    genres: {
      color: colors.primary,
      fontSize: fontSize.sall,
    },
  });
