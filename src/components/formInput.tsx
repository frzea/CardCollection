import { Control, FieldValues, Path, useController } from "react-hook-form";
import { ColorValue, KeyboardTypeOptions, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from "react-native";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  placeholderTextColor: ColorValue | undefined;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  secureTextEntry?: boolean; // закрывает пароль точками
  autoCapitalize?: TextInputProps["autoCapitalize"]; // не дает телефону делать первую букву заглавную
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  style,
  placeholderTextColor,
  keyboardType,
  multiline,
  secureTextEntry,
  autoCapitalize,
}: Props<T>) {
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
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
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
