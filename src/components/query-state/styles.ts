import { colors, fontWeight, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    iconColor: {
      color: theme.iconColor,
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
