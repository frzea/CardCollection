interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
}

export interface Seasons {
  animeId: string;
  seasonId: number;
  title: string;
  description: string;
  episodes: string;
  image: string;
}

export interface TitleCardItem {
  id: string;
  title: Title;
  coverImage: CoverImage;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
  seasons: Seasons[];
}
