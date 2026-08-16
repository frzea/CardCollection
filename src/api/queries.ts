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

const MEDIA_WITH_SEASONS_QUERY = `
  query ($id: Int) {
    Media(id: $id) {
      id
      title { romaji english }
      coverImage { large }
      description
      relations {
        edges {
          relationType
          node {
            id
            title { romaji english }
            coverImage { large }
            episodes
            seasonYear
            format
          }
        }
      }
    }
  }
`;

export { ANILIST_URL, MEDIA_WITH_SEASONS_QUERY, POPULAR_ANIME_QUERY };

