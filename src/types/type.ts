interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
}

export interface TitleCardItem {
  id: number;
  title: Title;
  coverImage: CoverImage;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
}
