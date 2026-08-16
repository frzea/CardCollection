import { fontSize, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchInput.background,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      height: spacing.large,
    },

    icon: {
      marginRight: spacing.sm,
    },

    input: {
      flex: spacing.one,
      fontSize: fontSize.md,
      padding: spacing.zero,
      color: theme.searchInput.text,
    },
  });
