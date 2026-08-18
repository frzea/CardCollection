import { gaps, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      gap: gaps.xm,
    },
  });
