const ANILIST_URL = "https://graphql.anilist.co";

const POPULAR_ANIME_QUERY = `
query {
  Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      episodes
      averageScore
      genres
    }
  }
}
`;

export { ANILIST_URL, POPULAR_ANIME_QUERY };

