import { fontSize, gaps, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
      gap: gaps.md,
    },
    cover: {
      width: 160,
      aspectRatio: 2 / 3,
      alignSelf: "center",
      borderRadius: radius.xs,
    },
    coverPlaceholder: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: theme.iconColor,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.4,
    },
    field: {
      gap: gaps.xs,
    },
    label: {
      color: theme.text,
      fontSize: fontSize.sm,
    },
    input: {
      backgroundColor: theme.searchInput.background,
      color: theme.searchInput.text,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      height: spacing.large,
      fontSize: fontSize.md,
    },
    multilineInput: {
      height: spacing.large * 2,
      paddingTop: spacing.sm,
      textAlignVertical: "top",
    },
  });
