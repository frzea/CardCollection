import { useMemo } from "react";
import { useTheme } from "./useTheme";

type Theme = ReturnType<typeof useTheme>["theme"];

// Берёт тему из контекста и создаёт стили через фабрику createStyles(theme)
export function useStyles<T>(factory: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
