import { ApiError } from "./api-error";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set your local IP.");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}/${path}`, { ...options, headers });
  const text = await response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, json);
  }

  return json as TResponse;
}

export function resolveImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}
