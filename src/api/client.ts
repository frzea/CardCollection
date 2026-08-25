const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function aniFetch<T>(url: string): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set your local IP."
    );
  }

  const response = await fetch(`${API_URL}/${url}`);
  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json as T;
}
