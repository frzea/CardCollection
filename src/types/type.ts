interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
}

interface TitleCardItem {
  id: string;
  title: Title;
  description: string;
  coverImage: CoverImage;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
}

interface Cards {
  cardId: number;
  collectionId: number;
  number: number;
  image: string;
}

interface Collections {
  id: number;
  manhwaId: number;
  collectionId: number;
  title: string;
  description: string;
  cards: number;
  image: string;
}

interface UserCard {
  id: string;
  collectionId: number;
  userId: number;
  cardId: number;
  count: number;
}

interface UserCollection {
  id: number;
  userId: number;
  collectionId: number;
}

type UserAuth = {
  userId: number;
  roleId: number;
};

export type { Cards, Collections, TitleCardItem, UserAuth, UserCard, UserCollection };

