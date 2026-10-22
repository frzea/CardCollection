import { OfflineScreen } from "@/components/offline-screen/offline";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/providers/ThemProvider";
import { AuthProvider } from "@/providers/authProvider";
import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ActivityIndicator, AppState, Platform } from "react-native";
export { ErrorScreen as ErrorBoundary } from "@/components/error-screen/error-screen";

// Мост NetInfo → TanStack Query. Выполняется один раз при загрузке модуля.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    // isInternetReachable === null на старте означает «ещё не проверено», считаем онлайн
    setOnline(!!state.isConnected && state.isInternetReachable !== false);
  }),
);

// Мост AppState → TanStack Query. На web оставляем дефолт (visibilitychange).
if (Platform.OS !== "web") {
  focusManager.setEventListener((handleFocus) => {
    const sub = AppState.addEventListener("change", (status) => {
      handleFocus(status === "active");
    });
    return () => sub.remove();
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 2,
    },
  },
});

function RootNavigator() {
  const { isLoggedIn, status } = useAuth();

  if (status === "loading") return <ActivityIndicator />;
  if (status === "offline") return <OfflineScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
