import { ApiError } from "@/api/api-error";
import { FormInput } from "@/components/formInput";
import { useAuth } from "@/hooks/useAuth";
import { RegisterFormData, registerSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function Register() {
  const { register } = useAuth();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { login: "", name: "", password: "" },
  });

  const onSubmit = async ({ passwordRepeat, ...data }: RegisterFormData) => {
    try {
      await register(data);
      // Stack.Protected сам покажет (main)
    } catch (err) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 409)) {
        const body = err.body as { error?: string; field?: "login" | "name" | "password" };
        if (body?.field) {
          setError(body.field, { message: err.status === 409 ? "Логин уже занят" : body.error });
          return;
        }
      }
      setError("root", { message: "Нет связи с сервером" });
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Registration</Text>

      <FormInput control={control} name="login" placeholder="Логин" style={styles.input} placeholderTextColor="#999" autoCapitalize="none" />
      <FormInput control={control} name="name" placeholder="Имя" style={styles.input} placeholderTextColor="#999" autoCapitalize="none" />
      <FormInput control={control} name="password" placeholder="Пароль" style={styles.input} placeholderTextColor="#999" secureTextEntry />
      <FormInput
        control={control}
        name="passwordRepeat"
        placeholder="Повторить пароль"
        style={styles.input}
        placeholderTextColor="#999"
        secureTextEntry
      />

      {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

      <Pressable style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Регистрация</Text>}
      </Pressable>

      <Link href="/login" style={styles.link}>
        Уже есть аккаунт? Войти
      </Link>
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
  link: {
    color: "#378ADD", // тот же синий, что у кнопки
    textAlign: "center",
    fontSize: 15,
    marginTop: 8,
  },
});
