import {
  colors,
  type ColorScheme,
  type Theme,
} from "@/design-system/theme/colors";
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
  const systemScheme: ColorScheme =
    useColorScheme() === "dark" ? "dark" : "light";
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

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
