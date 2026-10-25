import { onlineManager } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

type RefreshFn = () => Promise<unknown>;

export function useRefresh(fun: RefreshFn) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    if (!onlineManager.isOnline()) {
      Alert.alert("Нет сети", "Проверьте подключение к интернету");
      return;
    }

    setIsRefreshing(true);
    try {
      await fun();
    } finally {
      setIsRefreshing(false);
    }
  };

  return { onRefresh, isRefreshing };
}
