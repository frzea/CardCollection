import type { LoginResponse, User } from "@/types/type";
import { apiFetch } from "./client";
import { apiPOST } from "./events";

// Отправляет логин и пароль, возвращает токен и данные юзера
export function login(data: { login: string; password: string }) {
  return apiPOST<LoginResponse>("/auth/login", data);
}

// Спрашивает сервер, кто залогинен по текущему токену
export function getMe() {
  return apiFetch<User>("/auth/me");
}

// Сообщает серверу о выходе (пока сервер ничего не хранит, он просто отвечает 204)
export function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}
