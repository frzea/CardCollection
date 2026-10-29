import { fontSize, fontWeight, gaps, spacing } from "@/design-system/index";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

const AVATAR_SIZE = 88;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingBottom: spacing.xxl,
    },
    cover: {
      width: "100%",
      backgroundColor: theme.navBackground,
    },
    coverRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      marginTop: -AVATAR_SIZE / 2,
      marginLeft: spacing.lg,
      backgroundColor: theme.uiBackground,
      borderWidth: spacing.xs,
      borderColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    avatarLetter: {
      fontSize: spacing.xxxl,
      fontWeight: fontWeight.semibold,
      color: theme.textSecondary,
    },
    info: {
      marginTop: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    name: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: theme.title,
    },
    username: {
      marginTop: spacing.xs,
      fontSize: fontSize.md,
      color: theme.textSecondary,
    },
    stats: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: gaps.xxl,
      rowGap: gaps.s,
      marginTop: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    statNumber: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: theme.title,
    },
    statLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.normal,
      color: theme.textSecondary,
    },
  });
