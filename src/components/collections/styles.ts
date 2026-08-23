import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from "@/design-system/index";
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
      backgroundColor: "#b6b3b3",
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
    center: {
      flex: spacing.one,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    errorText: {
      color: colors.warning,
      marginBottom: spacing.md,
    },
    retryBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.xs,
    },
    retryText: {
      color: colors.white,
      fontWeight: fontWeight.semibold,
    },
  });
