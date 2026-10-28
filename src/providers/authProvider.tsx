import { ApiError } from "@/api/api-error";
import { getMe, login as loginRequest, logout as logoutRequest } from "@/api/auth";
import { setOnUnauthorized } from "@/api/axios-instance";
import { getToken, removeToken, setToken } from "@/api/token-storage";
import { User } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "offline";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  status: AuthStatus;
  logIn: (data: { login: string; password: string }) => Promise<void>;
  logOut: () => Promise<void>;
  retry: () => Promise<void>;
};

const ADMIN_ROLE = 1;

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // При запуске: если токен сохранён, спрашиваем сервер, кто это
  const checkAuth = useCallback(async () => {
    setStatus("loading");
    const token = await getToken();

    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    try {
      setUser(await getMe());
      setStatus("authenticated");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Сервер ответил «токен плохой» — честно разлогиниваем
        setUser(null);
        setStatus("unauthenticated");
      } else {
        // Сервер не ответил (нет сети) или сломался — токен НЕ трогаем
        console.log("Failed to verify token", err);
        setUser(null);
        setStatus("offline");
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Если во время работы пришёл 401, выходим
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setStatus("unauthenticated");
      queryClient.clear();
    });
  }, [queryClient]);

  const logIn = useCallback(async (data: { login: string; password: string }) => {
    const res = await loginRequest(data);
    await setToken(res.accessToken);
    setUser(res.user);
    setStatus("authenticated");
  }, []);

  const logOut = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Даже если сервер недоступен, выходим локально
    }
    await removeToken();
    setUser(null);
    setStatus("unauthenticated");
    queryClient.clear();
  }, [queryClient]);

  const isLoggedIn = status === "authenticated";
  const isAdmin = user?.role === ADMIN_ROLE;

  return <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, status, logIn, logOut, retry: checkAuth }}>{children}</AuthContext.Provider>;
}
