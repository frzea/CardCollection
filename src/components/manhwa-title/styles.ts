import { fontSize, fontWeight } from "@/design-system";
import type { Theme } from "@/design-system/theme/colors";
import { StyleSheet } from "react-native";
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: 300,
      overflow: "hidden",
      position: "relative",
      borderRadius: 12,
      justifyContent: "flex-end",
    },
    backgroundImage: {
      position: "absolute",
      width: "100%",
      height: "166.67%", // 100% / 0.6, т.к. видимая часть = 60% картинки
      top: "-16.67%", // сдвиг вверх = 10% от полной высоты картинки (166.67% * 0.10)
    },
    imageBgText: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: theme.text,
      margin: 20,
    },
    gradientOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "50%", // высота затемнённой зоны снизу, подберите под макет
    },
    titleText: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.bold,
      color: theme.text,
      marginTop: 15,
    },
  });
