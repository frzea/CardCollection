import { colors } from "./colors";
import { spacing } from "./spacing";

export { colors, spacing };

export const params = {
  colors,
  spacing,
} as const;

export type Params = typeof params;
