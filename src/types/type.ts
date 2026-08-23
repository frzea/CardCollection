interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
}

export interface Cards {
  cardId: number;
  collectionId: number;
  number: number;
  image: string;
}

export interface Collections {
  animeId: number;
  collectionId: number;
  title: string;
  description: string;
  cards: number;
  image: string;
}

export interface TitleCardItem {
  id: number;
  title: Title;
  coverImage: CoverImage;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
}
