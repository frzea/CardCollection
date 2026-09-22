interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
}

interface Manhwa {
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
  collectionId: string;
  number: number;
  image: string;
}

interface Collections {
  id: string;
  manhwaId: string;
  number: number;
  title: string;
  description: string;
  cards: string;
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

export type { Cards, Collections, Manhwa, UserAuth, UserCard, UserCollection };

