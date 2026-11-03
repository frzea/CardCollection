import { gaps, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    conteiner: {
      width: "100%",
      gap: gaps.lg,
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.xs,
      paddingTop: spacing.xs,
      borderRadius: 1,
      borderColor: theme.title,
    },
    track: {
      height: spacing.xs,
      backgroundColor: "#E5E5E5",
      borderRadius: 2,
    },

    progress: {
      height: spacing.xs,
      backgroundColor: "#9820bd",
      borderRadius: 2,
    },
  });
