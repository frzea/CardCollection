import { aniFetch } from "@/api/client";
import { useCallback, useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setAnime] = useState<T | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await aniFetch<T>(url);

      setAnime(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { loading, data, error, refetch: loadData };
}
