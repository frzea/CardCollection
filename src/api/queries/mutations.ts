import { apiDELETE, apiPATCH, apiPOST } from "@/api/events";
import { uploadImage } from "@/api/upload";
import { Cards, UserCard } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddVars = { existing?: UserCard; cardId: string; collectionId: string };

export function useAddUserCard(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ existing, cardId, collectionId }: AddVars) =>
      existing
        ? apiPATCH<UserCard>(`userCards/${existing.id}`, { count: existing.count + 1 })
        : apiPOST<UserCard>("userCards", { userId, collectionId, cardId, count: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCards", userId] }),
  });
}

export function useRemoveUserCard(userId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (existing: UserCard) =>
      existing.count <= 1 ? apiDELETE(`userCards/${existing.id}`) : apiPATCH<UserCard>(`userCards/${existing.id}`, { count: existing.count - 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userCards", userId] }),
  });
}

type UploadVars = { urls: string[]; startNumber: number };

export function useUploadCards(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ urls, startNumber }: UploadVars) => {
      for (const [index, url] of urls.entries()) {
        const image = await uploadImage(url);
        await apiPOST<Cards>("cards", { collectionId, number: startNumber + index + 1, image });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collectionCards", collectionId] }),
  });
}
