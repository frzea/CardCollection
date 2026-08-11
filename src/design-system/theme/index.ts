import { colors } from "./colors";
import { gaps } from "./gaps";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { fontSize, fontWeight } from "./typography";

export { colors, fontSize, fontWeight, gaps, radius, spacing };

export const params = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  gaps,
} as const;

export type Params = typeof params;
