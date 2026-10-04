import { getMe, login as loginRequest, logout as logoutRequest } from "@/api/auth";
import { setOnUnauthorized } from "@/api/axios-instance";
import { getToken, removeToken, setToken } from "@/api/token-storage";
import { User } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logIn: (data: { login: string; password: string }) => Promise<void>;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // При запуске: если токен сохранён, спрашиваем сервер, кто это
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setUser(await getMe());
      } catch {
        // При 401 интерсептор уже удалил токен, остальные ошибки просто показывают экран логина
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Если во время работы пришёл 401, выходим
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      queryClient.clear();
    });
  }, [queryClient]);

  const logIn = useCallback(async (data: { login: string; password: string }) => {
    const res = await loginRequest(data);
    await setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logOut = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Даже если сервер недоступен, выходим локально
    }
    await removeToken();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const isLoggedIn = user !== null;

  return <AuthContext.Provider value={{ user, isLoggedIn, loading, logIn, logOut }}>{children}</AuthContext.Provider>;
}
