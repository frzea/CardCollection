export const colors = {
  primary: "#6c5ce7",
  warning: "#cc475a",
  white: "#fff",

  dark: {
    text: "#f2f3ed",
    title: "#fff",
    background: "#0b0b0b",
    navBackground: "#201e2b",
    iconColor: "#bebaba",
    iconColorFocused: "#f01d16",
    uiBackground: "#2f2b3d",
    shadowColor: "#ffffff",
    searchInput: {
      background: "#1e1e1e",
      text: "#f2f3ed",
    },
  },
  light: {
    text: "#131314",
    title: "#201e2b",
    background: "#e0dfe8",
    navBackground: "#e8e7ef",
    iconColor: "#bebaba",
    iconColorFocused: "#f01d16",
    uiBackground: "#2f2b3d",
    shadowColor: "#000",
    searchInput: {
      background: "#d6d5e1",
      text: "#201e2b",
    },
  },
} as const;

export type ColorScheme = "light" | "dark";
export type Theme = (typeof colors)[ColorScheme];
