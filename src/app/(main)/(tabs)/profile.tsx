import { useAuth } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Tabs, useIsFocused } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Цвета экрана профиля
const profileTheme = {
  background: "#0E0E0E",
  cover: "#262626",
  avatarBg: "#2A2A2A",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  accent: "#FF3B30",
} as const;

const COVER_HEIGHT = 220;
const AVATAR_SIZE = 88;
const ICON_SIZE = 24;
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

// Склонение: 1 подписчик, 2 подписчика, 5 подписчиков (11–14 → «многие»)
function pluralize(n: number, forms: [one: string, few: string, many: string]) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

type ProfileScreenProps = {
  name: string;
  username: string;
  avatarUrl?: string;
  following: number;
  followers: number;
};

// Моки для превью
const MOCK_PROFILE: ProfileScreenProps = {
  name: "admin",
  username: "admin",
  following: 0,
  followers: 0,
};

type ProfileCoverProps = {
  onPressNotifications?: () => void;
  onPressMessages?: () => void;
  onPressMenu?: () => void;
};

function ProfileCover({ onPressNotifications, onPressMessages, onPressMenu }: ProfileCoverProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.cover, { paddingTop: insets.top, height: insets.top + COVER_HEIGHT }]}>
      <View style={styles.coverRow}>
        <View style={styles.coverLeft}>
          <Pressable hitSlop={HIT_SLOP} onPress={onPressNotifications} accessibilityLabel="Уведомления">
            <Ionicons name="notifications-outline" size={ICON_SIZE} color={profileTheme.accent} />
          </Pressable>
          <Pressable hitSlop={HIT_SLOP} onPress={onPressMessages} accessibilityLabel="Сообщения">
            <Ionicons name="chatbubble-outline" size={ICON_SIZE} color={profileTheme.accent} />
          </Pressable>
        </View>
        <Pressable hitSlop={HIT_SLOP} onPress={onPressMenu} accessibilityLabel="Меню">
          <Ionicons name="ellipsis-horizontal" size={ICON_SIZE} color={profileTheme.accent} />
        </Pressable>
      </View>
    </View>
  );
}

function ProfileAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const letter = name.trim().charAt(0).toUpperCase();

  return (
    <View style={styles.avatar}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
      ) : (
        <Text style={styles.avatarLetter}>{letter}</Text>
      )}
    </View>
  );
}

function ProfileInfo({ name, username }: { name: string; username: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.username} numberOfLines={1}>
        @{username}
      </Text>
    </View>
  );
}

type ProfileStatsProps = {
  following: number;
  followers: number;
  onPressFollowing?: () => void;
  onPressFollowers?: () => void;
};

function ProfileStats({ following, followers, onPressFollowing, onPressFollowers }: ProfileStatsProps) {
  return (
    <View style={styles.stats}>
      <Pressable hitSlop={HIT_SLOP} onPress={onPressFollowing}>
        <Text>
          <Text style={styles.statNumber}>{following}</Text>
          <Text style={styles.statLabel}> Подписки</Text>
        </Text>
      </Pressable>
      <Pressable hitSlop={HIT_SLOP} onPress={onPressFollowers}>
        <Text>
          <Text style={styles.statNumber}>{followers}</Text>
          <Text style={styles.statLabel}> {pluralize(followers, ["Подписчик", "Подписчика", "Подписчиков"])}</Text>
        </Text>
      </Pressable>
    </View>
  );
}

export function ProfileScreen({ name, username, avatarUrl, following, followers }: ProfileScreenProps) {
  const { logOut } = useAuth();
  const isFocused = useIsFocused();

  // Пока меню умеет только выходить из аккаунта
  const handleMenu = () => {
    Alert.alert("Меню", undefined, [
      { text: "Отмена", style: "cancel" },
      { text: "Выйти", style: "destructive", onPress: logOut },
    ]);
  };

  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      {/* Вкладки не размонтируются, поэтому светлый статус-бар только пока экран в фокусе */}
      {isFocused && <StatusBar style="light" />}
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ProfileCover onPressNotifications={() => {}} onPressMessages={() => {}} onPressMenu={handleMenu} />
        <ProfileAvatar name={name} avatarUrl={avatarUrl} />
        <ProfileInfo name={name} username={username} />
        <ProfileStats following={following} followers={followers} onPressFollowing={() => {}} onPressFollowers={() => {}} />
        {/* Здесь будет лента постов */}
      </ScrollView>
    </>
  );
}

export default function ProfilePage() {
  return <ProfileScreen {...MOCK_PROFILE} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: profileTheme.background,
  },
  content: {
    paddingBottom: 24,
  },
  cover: {
    width: "100%",
    backgroundColor: profileTheme.cover,
  },
  coverRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  coverLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginTop: -AVATAR_SIZE / 2,
    marginLeft: 16,
    backgroundColor: profileTheme.avatarBg,
    borderWidth: 4,
    borderColor: profileTheme.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: "600",
    color: profileTheme.textSecondary,
  },
  info: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: profileTheme.textPrimary,
  },
  username: {
    marginTop: 4,
    fontSize: 15,
    color: profileTheme.textSecondary,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 24,
    rowGap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: profileTheme.textPrimary,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "400",
    color: profileTheme.textSecondary,
  },
});
