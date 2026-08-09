export const colors = {
  primary: "#6849a7",
  warning: "#cc475a",

  dark: {
    text: "#f2f3ed",
    title: "#fff",
    background: "#0b0b0b",
    navBackground: "#201e2b",
    iconColor: "#9591a5",
    iconColorFocused: "#fd4944",
    uiBackground: "#2f2b3d",
    tabBar: "#1e1e1e",
  },
  light: {
    text: "#625f72",
    title: "#201e2b",
    background: "#e0dfe8",
    navBackground: "#e8e7ef",
    iconColor: "#686477",
    iconColorFocused: "#fd4944",
    uiBackground: "#d6d5e1",
    tabBar: "#1e1e1e",
  },
} as const;

export type ColorScheme = "light" | "dark";
export type Theme = (typeof colors)[ColorScheme];
