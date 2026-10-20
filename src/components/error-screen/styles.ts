import { fontSize, fontWeight, radius, spacing } from "@/design-system";
import { colors, type Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
      padding: spacing.xxl,
      backgroundColor: theme.background,
    },
    title: {
      color: theme.title,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      textAlign: "center",
    },
    button: {
      marginTop: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xxxl,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.white,
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
    },
  });
