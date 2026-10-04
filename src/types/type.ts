interface Title {
  romaji: string;
  english: string | null;
}

interface CoverImage {
  large: string;
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

export type { Cards, Collections, LoginResponse, Manhwa, User, UserAuth, UserCard, UserCollection };

