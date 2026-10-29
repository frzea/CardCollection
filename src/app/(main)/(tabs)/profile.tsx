import { createStyles } from "@/design-system/styles/profile";
import { useAuth } from "@/hooks/useAuth";
import { useStyles } from "@/hooks/useStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const profileTheme = {
  accent: "#FF3B30",
} as const;

const COVER_HEIGHT = 220;
const ICON_SIZE = 32;
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

function ProfileCover() {
  const insets = useSafeAreaInsets();
  const { logOut } = useAuth();
  const style = useStyles(createStyles);

  const handleMenu = () => {
    Alert.alert("Logout?", undefined, [
      { text: "Ok", style: "destructive", onPress: logOut },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={[style.cover, { paddingTop: insets.top, height: insets.top + COVER_HEIGHT }]}>
      <View style={style.coverRow}>
        <Pressable hitSlop={HIT_SLOP} onPress={handleMenu} accessibilityLabel="Меню">
          <Ionicons name="log-out-outline" size={ICON_SIZE} color={profileTheme.accent} />
        </Pressable>
      </View>
    </View>
  );
}

function ProfileAvatar() {
  const style = useStyles(createStyles);
  const { user } = useAuth();
  const letter = user?.name.trim().charAt(0).toUpperCase();
  const avatarUrl = undefined;

  return (
    <View style={style.avatar}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={style.avatarImage} contentFit="cover" />
      ) : (
        <Text style={style.avatarLetter}>{letter}</Text>
      )}
    </View>
  );
}

function ProfileInfo() {
  const style = useStyles(createStyles);
  const { user } = useAuth();
  return (
    <View style={style.info}>
      <Text style={style.name} numberOfLines={1}>
        {user?.name}
      </Text>
      <Text style={style.username} numberOfLines={1}>
        @{user?.name}
      </Text>
    </View>
  );
}

function ProfileStats() {
  const style = useStyles(createStyles);
  return (
    <View style={style.stats}>
      <Pressable hitSlop={HIT_SLOP}>
        <Text>
          <Text style={style.statNumber}>{0}</Text>
          <Text style={style.statLabel}> Подписки</Text>
        </Text>
      </Pressable>
      <Pressable hitSlop={HIT_SLOP}>
        <Text>
          <Text style={style.statNumber}>{0}</Text>
          <Text style={style.statLabel}> {"Подписчиков"}</Text>
        </Text>
      </Pressable>
    </View>
  );
}

export default function ProfilePage() {
  const style = useStyles(createStyles);
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <ScrollView style={style.screen} contentContainerStyle={style.content}>
        <ProfileCover />
        <ProfileAvatar />
        <ProfileInfo />
        <ProfileStats />
      </ScrollView>
    </>
  );
}
