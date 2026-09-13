import useAsyncStorage from "@/hooks/useAsuncStorage";
import { UserAuth } from "@/types/type";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [auth, setAuth, loading] = useAsyncStorage<UserAuth>({
    key: "user-auth",
    initialValue: { userId: 0, roleId: 0 },
  });

  const handleLogin = async (userId: number, roleId: number) => {
    // userId — здесь должен приходить с сервера/из вашей логики авторизации
    // пока условно генерирую заглушку

    await setAuth({ userId, roleId });
    router.replace("/(tabs)");
  };

  return (
    <View style={stales.page}>
      <Text style={stales.title}>Please choose your role:</Text>
      <View style={stales.buttonAria}>
        <Pressable style={[stales.button, { backgroundColor: "#E24B4A" }]} onPress={() => handleLogin(1, 1)}>
          <Text style={[stales.btnText, { color: "#501313" }]}>Admin</Text>
        </Pressable>
        <Pressable style={[stales.button, { backgroundColor: "#378ADD" }]} onPress={() => handleLogin(2, 2)}>
          <Text style={[stales.btnText, { color: "#1E1B36" }]}>User</Text>
        </Pressable>
      </View>
    </View>
  );
}

const stales = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#282330",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    color: "#ffff",
    fontSize: 20,
  },
  buttonAria: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 120,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 20,
  },
});
