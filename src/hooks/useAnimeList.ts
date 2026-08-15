import { fetchPopularAnime } from "@/api/card-title-list/client";
import { TitleCardItem } from "@/types/type";
import { useCallback, useEffect, useState } from "react";

export function useAnimeList() {
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState<TitleCardItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const media = await fetchPopularAnime();
      setAnime(media);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { loading, anime, error, refetch: loadData };
}
