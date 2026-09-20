import { apiFetch } from "@/api/client";
import { Cards, Collections, TitleCardItem, UserCard } from "@/types/type";
import { useQuery } from "@tanstack/react-query";

export function useManhwas() {
  return useQuery({
    queryKey: ["manhwas"],
    queryFn: () => apiFetch<TitleCardItem[]>("manhwa"),
  });
}

export function useManhwa(manhwaId: string) {
  return useQuery({
    queryKey: ["manhwa", manhwaId],
    queryFn: () => apiFetch<TitleCardItem>(`manhwa/${manhwaId}`),
  });
}

export function useCollection(manhwaId: string) {
  return useQuery({
    queryKey: ["collections", manhwaId],
    queryFn: () => apiFetch<Collections[]>(`collections?manhwaId=${manhwaId}`),
  });
}

export function useCollectionCards(collectionId: string) {
  return useQuery({
    queryKey: ["collectionCards", collectionId],
    queryFn: () => apiFetch<Cards[]>(`cards?collectionId=${collectionId}`),
  });
}

export function useUserCards(userId: number) {
  return useQuery({
    queryKey: ["userCards", userId],
    queryFn: () => apiFetch<UserCard[]>(`userCards?userId=${userId}`),
  });
}
