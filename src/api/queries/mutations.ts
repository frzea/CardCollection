import { ApiError } from "@/api/api-error";
import { apiDELETE, apiPATCH, apiPOST } from "@/api/events";
import { uploadImage } from "@/api/upload";
import { Cards, Collections, Manhwa, UserCard } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

type AddVars = { existing?: UserCard; cardId: string; collectionId: string };

export function useAddUserCard(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ existing, cardId, collectionId }: AddVars) =>
      existing
        ? apiPATCH<UserCard>(`userCards/${existing.id}`, { count: existing.count + 1 })
        : apiPOST<UserCard>("userCards", { userId, collectionId, cardId, count: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCards", userId] }),
    onError: () => Alert.alert("Ошибка", "Не удалось добавить карточку"),
  });
}

export function useRemoveUserCard(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (existing: UserCard) =>
      existing.count <= 1 ? apiDELETE(`userCards/${existing.id}`) : apiPATCH<UserCard>(`userCards/${existing.id}`, { count: existing.count - 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCards", userId] }),
    onError: () => Alert.alert("Ошибка", "Не удалось удалить карточку"),
  });
}

type UploadVars = {
  urls: string[];
  onUploaded?: (url: string) => void;
};

export function useUploadCards(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ urls, onUploaded }: UploadVars) => {
      for (const url of urls) {
        const image = await uploadImage(url);
        await apiPOST<Cards>("cards", { collectionId, image });
        onUploaded?.(url);
      }
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 400) {
        Alert.alert("Коллекция заполнена", "Оставшиеся картинки не будут загружены");
      } else {
        Alert.alert("Ошибка", "Не все карточки загрузились. Нажмите ещё раз, чтобы догрузить остальные");
      }
    },
    // onSettled срабатывает и при успехе, и при ошибке
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["collectionCards", collectionId] }),
  });
}

export function useAddCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collection: Omit<Collections, "id" | "number">) => apiPOST<Collections>("collections", collection),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });
}

export function useAddManhwa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (manhwa: Omit<Manhwa, "id">) => apiPOST<Manhwa>("manhwa", manhwa),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["manhwas"] }),
  });
}
