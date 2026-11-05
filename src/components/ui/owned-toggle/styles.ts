import { colors, fontWeight, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      alignSelf: "flex-start",
      marginVertical: spacing.xs,
      marginHorizontal: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.xs,
      backgroundColor: theme.navBackground,
    },
    text: {
      color: colors.primary,
      fontWeight: fontWeight.semibold,
    },
  });
