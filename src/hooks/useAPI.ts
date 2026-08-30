import { apiFetch } from "@/api/client";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFetch<T>(path: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(
    async (signal: AbortSignal) => {
      try {
        setLoading(true);
        const data = await apiFetch<T>(path, { signal });

        setData(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [path],
  );

  const runFetch = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    loadData(controllerRef.current.signal);
  }, [loadData]);

  useEffect(() => {
    runFetch();

    return () => {
      controllerRef.current?.abort();
    };
  }, [runFetch]);

  return { loading, data, error, refetch: runFetch, setData };
}
