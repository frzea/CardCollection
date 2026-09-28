import useAsyncStorage from "@/hooks/useAsuncStorage";
import { UserAuth } from "@/types/type";
import { createContext, PropsWithChildren } from "react";

type AuthState = {
  auth: UserAuth;
  isLoggedIn: boolean;
  loading: boolean;
  logIn: (userId: number, roleId: number) => void;
  logOut: () => void;
};

const EMPTY_AUTH: UserAuth = { userId: 0, roleId: 0 };

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth, loading] = useAsyncStorage<UserAuth>({
    key: "user-auth",
    initialValue: EMPTY_AUTH,
  });

  const logIn = (userId: number, roleId: number) => {
    setAuth({ userId, roleId });
  };

  const logOut = () => {
    setAuth(EMPTY_AUTH);
  };

  const isLoggedIn = auth.userId !== 0;

  return <AuthContext.Provider value={{ auth, isLoggedIn, loading, logIn, logOut }}>{children}</AuthContext.Provider>;
}
