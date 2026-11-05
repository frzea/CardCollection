interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string | null;
}

interface User {
  id: number;
  name: string;
  role: number;
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

type MyManhwa = Manhwa & {
  owned: number;
  total: number;
};

interface Cards {
  id: string;
  collectionId: string;
  number: number;
  image: string;
}

interface Collections {
  id: string;
  manhwaId: string;
  releaseDate: string; // ГГГГ-ММ-ДД, по нему сортируются коллекции
  title: string;
  description: string;
  cards: number;
  image: string;
}

interface UserCard {
  id: number;
  collectionId: string;
  manhwaId: string;
  userId: number;
  cardId: string;
  count: number;
}

interface UserCollection {
  id: string;
  userId: number;
  collectionId: string;
}

type UserAuth = {
  userId: number;
  roleId: number;
};

type LoginResponse = {
  accessToken: string;
  user: User;
};

export type { Cards, Collections, LoginResponse, Manhwa, MyManhwa, User, UserAuth, UserCard, UserCollection };

