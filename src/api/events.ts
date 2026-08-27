import { apiFetch } from "./client";

export async function getAnimeData<T>(id: number) {
  return apiFetch<T>(`anime/${id}`);
}
