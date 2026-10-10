import * as SecureStore from "expo-secure-store";

// Ключ, под которым токен лежит в SecureStore.
const TOKEN_KEY = "auth_token";

// Возвращает токен или null, если его нет
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    // Если хранилище сломалось, считаем, что токена нет: пользователь увидит экран логина
    return null;
  }
}

// Сохраняет токен после успешного логина
export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

// Удаляет токен при выходе
export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
