import { useStyles } from "@/hooks/useStyles";
import { Text, TouchableOpacity } from "react-native";
import { createStyles } from "./styles";

type OwnedToggleProps = {
  showAll: boolean;
  onToggle: () => void;
};

export function OwnedToggle({ showAll, onToggle }: OwnedToggleProps) {
  const style = useStyles(createStyles);
  return (
    <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={onToggle}>
      <Text style={style.text}>{showAll ? "My items" : "All items"}</Text>
    </TouchableOpacity>
  );
}
