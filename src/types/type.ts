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
  id: string;
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
  id: number;
  collectionId: string;
  userId: string;
  cardId: string;
  count: number;
}

interface UserCollection {
  id: string;
  userId: string;
  collectionId: string;
}

type UserAuth = {
  userId: number;
  roleId: number;
};

export type { Cards, Collections, Manhwa, UserAuth, UserCard, UserCollection };

