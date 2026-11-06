import { colors } from "@/design-system/index";
import { useStyles } from "@/hooks/useStyles";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles";

type QueryStateProps = {
  error: Error | null;
  isPaused: boolean;
  onRetry: () => void;
};

export function QueryState({ error, isPaused, onRetry }: QueryStateProps) {
  const style = useStyles(createStyles);

  if (error) {
    return (
      <View style={style.center}>
        <Text style={style.errorText}>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => onRetry()} style={style.retryBtn}>
          <Text style={style.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isPaused) {
    return (
      <View style={style.center}>
        <Feather name="wifi-off" size={48} color={style.iconColor.color} />
        <Text style={style.errorText}>No connection. Data will load automatically.</Text>
      </View>
    );
  }

  return (
    <View style={style.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
