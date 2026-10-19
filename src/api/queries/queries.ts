import { apiFetch } from "@/api/client";
import { Cards, Collections, Manhwa, UserCard } from "@/types/type";
import { useQuery } from "@tanstack/react-query";

export function useManhwas() {
  return useQuery({
    queryKey: ["manhwas"],
    queryFn: () => apiFetch<Manhwa[]>("manhwa"),
  });
}

export function useManhwa(manhwaId: string) {
  return useQuery({
    queryKey: ["manhwa", manhwaId],
    queryFn: () => apiFetch<Manhwa>(`manhwa/${manhwaId}`),
  });
}

export function useCollection(manhwaId: string) {
  return useQuery({
    queryKey: ["collections", manhwaId],
    queryFn: () => apiFetch<Collections[]>(`collections?manhwaId=${manhwaId}&_sort=releaseDate&_order=asc`),
  });
}

export function useCollectionById(collectionId: string) {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => apiFetch<Collections>(`collections/${collectionId}`),
  });
}

export function useCollectionCards(collectionId: string) {
  return useQuery({
    queryKey: ["collectionCards", collectionId],
    queryFn: () => apiFetch<Cards[]>(`cards?collectionId=${collectionId}`),
  });
}

export function useUserCards() {
  return useQuery({
    queryKey: ["userCards"],
    queryFn: async () => {
      return apiFetch<UserCard[]>(`userCards`);
    },
  });
}
