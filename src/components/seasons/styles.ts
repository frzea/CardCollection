import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flatList: {
      gap: 12,
    },
    card: {
      flexDirection: "row",
      backgroundColor: theme.background,

      overflow: "hidden",
      height: 200,
    },
    cover: {
      width: 150,
      height: "100%",
    },
    info: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
    },
  });
