import { colors, fontWeight, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      alignSelf: "flex-end",
      marginVertical: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: radius.xs,
      backgroundColor: theme.navBackground,
    },
    text: {
      color: colors.primary,
      fontWeight: fontWeight.semibold,
    },
  });
