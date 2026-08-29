import { fontSize, fontWeight, radius } from "@/design-system";
import { colors, Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      height: "45%",
      backgroundColor: "#3d3b3b",
      bottom: 0,
    },
    image: {
      width: 200,
      height: 200,
    },
    badge: {
      position: "absolute",
      top: 4,
      right: 4,
      minWidth: 20,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: colors.white,
      fontSize: fontSize.sall,
      fontWeight: fontWeight.bold,
    },
    number: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: theme.text,
      marginTop: 12,
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginTop: 16,
    },
    controlButton: {
      width: 48,
      height: 48,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    controlButtonDisabled: {
      backgroundColor: theme.iconColor,
    },
    controlButtonText: {
      color: colors.white,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
    },
    countText: {
      minWidth: 32,
      textAlign: "center",
      color: theme.text,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
    },
  });
