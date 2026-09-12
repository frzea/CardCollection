import { apiFetch } from "./client";

export async function apiPOST<TResponse, TBody = unknown>(path: string, body: TBody) {
  return apiFetch<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPATCH<TResponse, TBody = unknown>(path: string, body: TBody) {
  return apiFetch<TResponse>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiDELETE(path: string) {
  return apiFetch(path, {
    method: "DELETE",
  });
}
