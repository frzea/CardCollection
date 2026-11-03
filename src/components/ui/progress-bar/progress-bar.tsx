import { useStyles } from "@/hooks/useStyles";
import { View } from "react-native";
import { createStyles } from "./styles";

type Props = {
  step: number;
  total: number;
};

export default function ProgressBar({ step, total }: Props) {
  const style = useStyles(createStyles);
  return (
    <View style={style.conteiner}>
      <View style={style.track}>
        <View style={[style.progress, { width: `${(step / total) * 100}%` }]} />
      </View>
    </View>
  );
}
