import { Control, FieldValues, Path, useController } from "react-hook-form";
import { ColorValue, StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from "react-native";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  placeholderTextColor: ColorValue | undefined;
};

export function FormInput<T extends FieldValues>({ control, name, placeholder, style, placeholderTextColor }: Props<T>) {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <View>
      <TextInput
        style={style}
        placeholder={placeholder}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        placeholderTextColor={placeholderTextColor}
      />
      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
