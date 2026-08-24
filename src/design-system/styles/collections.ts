import { gaps, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searcView: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      gap: gaps.xm,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 15,
    },
    modalBgContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    modal: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "30%",
      backgroundColor: "#ffff",
      bottom: 0,
    },
  });
