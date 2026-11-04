import { useSegments } from "expo-router";

export function useIsMineTab() {
  const segments = useSegments() as string[];
  return segments.includes("(mine)");
}
