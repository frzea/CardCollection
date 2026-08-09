import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    searcView: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: 10,
      paddingTop: 20,
      gap: 10,
    },
    text: {
      color: theme.text,
      fontSize: 32,
    },
  });
