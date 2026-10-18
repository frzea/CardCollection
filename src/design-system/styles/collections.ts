import { colors, fontWeight, gaps, radius, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searcView: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      gap: gaps.xm,
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
    button: {
      justifyContent: "center",
      alignItems: "center",
      height: spacing.xxl,
      width: spacing.xl * 6,
      backgroundColor: theme.iconColor,
      alignSelf: "flex-end",
    },
    center: {
      flex: spacing.one,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
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
