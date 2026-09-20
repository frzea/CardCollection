import { createStyles } from "@/design-system/styles/new-manhwa";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export default function NewManhwa() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets[0].uri;
      setSelectedImage(uris);
    } else {
      alert("Tou did not select any image.");
    }
  };

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Screen
        options={{
          title: "Creating new collection",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.searchInput.background,
          },
          headerTintColor: theme.text,
        }}
      />
      <View style={style.page}>
        <ScrollView contentContainerStyle={style.content}>
          <TouchableOpacity onPress={pickImageAsync}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={style.cover} resizeMode="cover" />
            ) : (
              <View style={[style.cover, style.coverPlaceholder]}>
                <Feather name="image" size={48} color={theme.iconColor} />
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}
