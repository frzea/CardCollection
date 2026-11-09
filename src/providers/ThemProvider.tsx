import { colors, type ColorScheme, type Theme } from "@/design-system/theme/colors";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router";
import { createContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeContextValue = {
  theme: Theme;
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme: ColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colorScheme: ColorScheme = isDark ? "dark" : "light";

  const value = useMemo(
    () => ({
      theme: colors[colorScheme],
      colorScheme,
      isDark,
      toggleTheme,
    }),
    [colorScheme, isDark],
  );

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    const theme = colors[colorScheme];
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.background,
        card: theme.navBackground,
        text: theme.text,
      },
    };
  }, [isDark, colorScheme]);

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
