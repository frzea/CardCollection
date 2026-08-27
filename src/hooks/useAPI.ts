import { apiFetch } from "@/api/client";
import { useCallback, useEffect, useState } from "react";

export function useFetch<T>(path: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<T>(path);

      setData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { loading, data, error, refetch: loadData };
}
