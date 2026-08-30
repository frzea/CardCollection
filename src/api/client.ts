const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set your local IP.");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}/${path}`, { ...options, headers });
  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json as TResponse;
}

export function resolveImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}
