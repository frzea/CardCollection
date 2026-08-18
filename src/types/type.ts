interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
}

export interface Seasons {
  animeId: string;
  seasonId: string;
  title: string;
  description: string;
  episode: number;
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
