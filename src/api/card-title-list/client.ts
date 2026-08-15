import { ANILIST_URL, POPULAR_ANIME_QUERY } from "./queries";

export async function fetchPopularAnime() {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: POPULAR_ANIME_QUERY }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data.Page.media;
}
