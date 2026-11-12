import { ApiError } from "@/api/api-error";
import { apiDELETE, apiPOST } from "@/api/events";
import { uploadImage } from "@/api/upload";
import { Cards, Collections, Manhwa, UserCard } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useAddUserCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => apiPOST<UserCard>(`me/cards/${cardId}`, {}),
    onSuccess: () =>
      Promise.all([queryClient.invalidateQueries({ queryKey: ["userCards"] }), queryClient.invalidateQueries({ queryKey: ["myManhwas"] })]),
    onError: () => Alert.alert("Ошибка", "Не удалось добавить карточку"),
  });
}

export function useRemoveUserCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => apiDELETE(`me/cards/${cardId}`),
    onSuccess: () =>
      Promise.all([queryClient.invalidateQueries({ queryKey: ["userCards"] }), queryClient.invalidateQueries({ queryKey: ["myManhwas"] })]),
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
      if (error instanceof ApiError && error.status === 409) {
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
    mutationFn: (collection: Omit<Collections, "id">) => apiPOST<Collections>("collections", collection),
    onSuccess: () =>
      Promise.all([queryClient.invalidateQueries({ queryKey: ["collections"] }), queryClient.invalidateQueries({ queryKey: ["myManhwas"] })]),
  });
}

export function useAddManhwa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (manhwa: Omit<Manhwa, "id">) => apiPOST<Manhwa>("manhwa", manhwa),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["manhwas"] }),
  });
}
