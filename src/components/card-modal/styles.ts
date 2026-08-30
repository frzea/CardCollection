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
      justifyContent: "flex-start",
      paddingTop: 20,
      width: "100%",
      height: "60%",
      backgroundColor: "#3d3b3b",
      bottom: 0,
      borderTopEndRadius: 15,
      borderTopStartRadius: 15,
    },
    imageBox: {
      aspectRatio: 2 / 3,
      height: 250,
      borderRadius: 15,
    },
    image: {
      ...StyleSheet.absoluteFill,
      borderRadius: 15,
    },
    badge: {
      position: "absolute",
      bottom: 8,
      right: 8,
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
