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
    list: {
      padding: spacing.sm,
      backgroundColor: theme.headBackground,
    },
    row: {
      justifyContent: "space-between",
    },
    card: {
      width: "48%",
      backgroundColor: theme.background,
      borderRadius: radius.sm,
      marginBottom: spacing.xl,
      overflow: "hidden",
      elevation: spacing.xs, //тень для android
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.3,
      shadowRadius: spacing.xs,
    },
    cover: {
      width: "100%",
      height: 220,
      backgroundColor: "#222",
    },
    info: {
      padding: spacing.sm,
    },
    title: {
      color: theme.text,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      marginBottom: spacing.xs,
    },
    meta: {
      color: theme.text,
      fontSize: fontSize.sall,
      marginBottom: 2,
    },
    genres: {
      color: colors.primary,
      fontSize: fontSize.sall,
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
