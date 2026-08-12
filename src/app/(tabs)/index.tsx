import { SearchInput } from "@/components/ui/search-input/search-input";
import { createStyles } from "@/design-system/styles/search-page";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ANILIST_URL = "https://graphql.anilist.co";

const QUERY = `
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

interface AnimeTitle {
  romaji: string;
  english: string | null;
}

interface AnimeCoverImage {
  large: string;
}

interface AnimeItem {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
}

export default function SearchPage() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const style = createStyles(theme);
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const response = await fetch(ANILIST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: QUERY }),
      });

      const json = await response.json();

      if (json.errors) {
        throw new Error(json.errors[0]?.message || "GraphQL error");
      }

      setAnime(json.data.Page.media);
      setError(null);
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = ({ item }: { item: AnimeItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.coverImage.large }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title.english || item.title.romaji}
        </Text>
        <Text style={styles.meta}>
          {item.episodes ? `${item.episodes} эп.` : "—"} · ⭐{" "}
          {item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A"}
        </Text>
        <Text style={styles.genres} numberOfLines={1}>
          {item.genres.slice(0, 3).join(", ")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ошибка: {error}</Text>
        <TouchableOpacity onPress={fetchAnime} style={styles.retryBtn}>
          <Text style={styles.retryText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={style.searcView}>
      <View style={style.content}>
        <Text style={style.text}>Review</Text>
        <SearchInput />
        <FlatList
          data={anime}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 70 },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 8,
    backgroundColor: "#0f0f1a",
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "45%",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cover: {
    width: "100%",
    height: 220,
    backgroundColor: "#222",
  },
  info: {
    padding: 8,
  },
  title: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    color: "#a0a0b0",
    fontSize: 11,
    marginBottom: 2,
  },
  genres: {
    color: "#6c5ce7",
    fontSize: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
