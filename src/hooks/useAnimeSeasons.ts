import { aniFetch } from "@/api/client";
import { TitleCardItem } from "@/types/type";
import { useCallback, useEffect, useState } from "react";

export function useAnimeSeasons(id: string) {
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState<TitleCardItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const media = await aniFetch();

      console.log(media);

      //setAnime(media);
      setError(null);
    } catch (err) {
      console.log("ERROR:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { loading, anime, error, refetch: loadData };
}
