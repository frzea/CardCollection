export const colors = {
  primary: "#6c5ce7",
  warning: "#cc475a",
  white: "#fff",

  dark: {
    text: "#f2f3ed",
    textSecondary: "#8E8E93",
    title: "#FFFFFF", //"#fff",
    background: "#0E0E0E", //"#242329",
    navBackground: "#262626", //"#3f3f42",
    iconColor: "#bebaba",
    iconColorFocused: "#f01d16",
    uiBackground: "#2A2A2A", //"#2f2b3d",
    shadowColor: "#ffffff",
    headBackground: "#242329",
    searchInput: {
      background: "#1e1e1e",
      text: "#f2f3ed",
    },
  },
  light: {
    text: "#131314",
    textSecondary: "#8E8E93",
    title: "#201e2b",
    background: "#e0dfe8",
    navBackground: "#e8e7ef",
    iconColor: "#bebaba",
    iconColorFocused: "#f01d16",
    uiBackground: "#2f2b3d",
    shadowColor: "#000",
    headBackground: "#e8e7ef",
    searchInput: {
      background: "#d6d5e1",
      text: "#201e2b",
    },
  },
} as const;

export type ColorScheme = "light" | "dark";
export type Theme = (typeof colors)[ColorScheme];
