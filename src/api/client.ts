export async function aniFetch<T>(url: string): Promise<T> {
  const response = await fetch(`http://192.168.0.104:3001/${url}`);
  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json as T;
}
