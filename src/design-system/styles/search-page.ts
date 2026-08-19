import { fontSize, gaps, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searcView: {
      flex: 1,
      backgroundColor: theme.headBackground,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      gap: gaps.xm,
    },
    text: {
      color: theme.text,
      fontSize: fontSize.fab,
    },
  });
