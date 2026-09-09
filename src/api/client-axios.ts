import { isAxiosError } from "axios";
import { ApiError } from "./api-error";
import { api } from "./axios-instance";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ApiRequestOptions {
  method?: string;
  body?: string;
  signal?: AbortSignal;
}

export async function apiFetch<TResponse>(path: string, options: ApiRequestOptions = {}): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set your local IP.");
  }

  try {
    const response = await api.request<TResponse>({
      url: path,
      method: options.method,
      data: options.body,
      signal: options.signal,
    });
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      throw new ApiError(err.response.status, err.response.data);
    }
    throw err;
  }
}

export function resolveImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}
