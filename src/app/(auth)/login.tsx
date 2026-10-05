import { ApiError } from "@/api/api-error";
import { FormInput } from "@/components/formInput";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

// Правила для полей: пустой логин или пароль не отправляем на сервер
const schema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { logIn } = useAuth();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await logIn(data);
      // После успешного входа сюда ничего писать не нужно: Stack.Protected сам покажет (main)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("root", { message: "Неверный логин или пароль" });
      } else {
        setError("root", { message: "Нет связи с сервером" });
      }
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Вход</Text>

      <FormInput control={control} name="login" placeholder="Логин" style={styles.input} placeholderTextColor="#999" autoCapitalize="none" />
      <FormInput control={control} name="password" placeholder="Пароль" style={styles.input} placeholderTextColor="#999" secureTextEntry />

      {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

      <Pressable style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Войти</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#282330",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#3a3442",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
  },
  error: {
    color: "#E24B4A",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#378ADD",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
  },
});
