import AsyncStorage from "@react-native-async-storage/async-storage";

// Ключ, под которым токен лежит в AsyncStorage.
// Старый ключ "user-auth" сюда не подходит: там лежит другой формат.
const TOKEN_KEY = "accessToken";

// Возвращает токен или null, если его нет
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    // Если хранилище сломалось, считаем, что токена нет: пользователь увидит экран логина
    return null;
  }
}

// Сохраняет токен после успешного логина
export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

// Удаляет токен при выходе
export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
