import { ApiError } from "@/api/api-error";
import { getMe, login as loginRequest, logout as logoutRequest, register as registerRequest } from "@/api/auth";
import { setOnUnauthorized } from "@/api/axios-instance";
import { getToken, removeToken, setToken } from "@/api/token-storage";
import { User } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "offline";

type LoginResponse = {
  login: string;
  name: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  status: AuthStatus;
  logIn: (data: { login: string; password: string }) => Promise<void>;
  logOut: () => Promise<void>;
  retry: () => Promise<void>;
  register: (data: LoginResponse) => Promise<void>;
};

const ADMIN_ROLE = 1;

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const checkAuth = useCallback(async (token: string | null) => {
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

  const retry = useCallback(async () => {
    setStatus("loading");
    await getToken().then(checkAuth);
  }, [checkAuth]);

  useEffect(() => {
    getToken().then(checkAuth);
  }, [checkAuth]);

  // Если во время работы пришёл 401, выходим
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setStatus("unauthenticated");
      queryClient.clear();
    });
  }, [queryClient]);

  const register = useCallback(async (data: LoginResponse) => {
    const res = await registerRequest(data);
    await setToken(res.accessToken);
    setUser(res.user);
    setStatus("authenticated");
  }, []);

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

  return <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, status, register, logIn, logOut, retry }}>{children}</AuthContext.Provider>;
}
