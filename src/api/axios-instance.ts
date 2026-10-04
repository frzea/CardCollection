import axios, { isAxiosError } from "axios";
import { getToken, removeToken } from "./token-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // обязательно вернуть config, иначе запрос не уйдёт
});

// Функцию для выхода регистрирует AuthProvider
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

api.interceptors.response.use(
  (response) => response, // успешные ответы пропускаем как есть
  async (error) => {
    const isLoginRequest = error.config?.url === "/auth/login";
    if (isAxiosError(error) && error.response?.status === 401 && !isLoginRequest) {
      await removeToken();
      onUnauthorized?.(); // сообщаем провайдеру, что надо выйти
    }
    return Promise.reject(error); // обязательно пробросить ошибку дальше
  },
);
