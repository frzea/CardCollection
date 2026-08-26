import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    cardWrapper: {
      padding: 4,
      aspectRatio: 3 / 4, // под форму карточки
    },
    cardInner: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
    },
  });
