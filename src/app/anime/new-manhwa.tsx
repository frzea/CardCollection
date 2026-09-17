import { createStyles } from "@/design-system/styles/new-manhwa";
import { FormInput } from "@/hooks/useController";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  titleEn: z.string().min(4, "Имя должно быть не короче 4 символов"),
  titleRom: z.string().min(4, "Имя должно быть не короче 4 символов"),
  description: z.string().min(4, "не мение4х символов").max(30, "не более 30 символов"),
  genres: z.string().min(4, " должно быть не короче 4 символов"),
  averageScore: z
    .string()
    .min(1, "минимум 1")
    .refine((val) => Number(val) <= 100, "больше 100 нельзя"),
  episodes: z.string().min(1, "минимум 1"),
});

type FormData = z.infer<typeof schema>;

export default function NewManhwa() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const [permissionResponse, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { titleEn: "", titleRom: "", description: "", genres: "", averageScore: "", episodes: "" },
  });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      const uris = result.assets.map((a) => a.uri);
      setSelectedImage((prev) => [...prev, ...uris]);
      setShowAppOptions(true);
    } else {
      alert("Tou did not select any image.");
    }
  };

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Screen
        options={{
          title: "Creating new manhwa",
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
            {selectedImage.length > 0 ? (
              <Image source={{ uri: selectedImage[selectedImage.length - 1] }} style={style.cover} resizeMode="cover" />
            ) : (
              <View style={[style.cover, style.coverPlaceholder]}>
                <Feather name="image" size={48} color={theme.iconColor} />
              </View>
            )}
          </TouchableOpacity>

          <View style={style.field}>
            <Text style={style.label}>Title (English)</Text>
            <FormInput control={control} name="titleEn" placeholder="English title" style={style.input} placeholderTextColor={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Title (Romaji)</Text>
            <FormInput control={control} name="titleRom" placeholder="Romaji title" style={style.input} placeholderTextColor={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Description</Text>
            <FormInput
              control={control}
              name="description"
              placeholder="Description"
              style={[style.input, style.multilineInput]}
              placeholderTextColor={theme.iconColor}
              multiline
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Genres</Text>
            <FormInput
              control={control}
              name="genres"
              placeholder="Genres (comma separated)"
              style={style.input}
              placeholderTextColor={theme.iconColor}
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Average score</Text>
            <FormInput
              control={control}
              name="averageScore"
              placeholder="Average score"
              style={style.input}
              placeholderTextColor={theme.iconColor}
              keyboardType="numeric"
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Episodes</Text>
            <FormInput
              control={control}
              name="episodes"
              placeholder="Episodes"
              style={style.input}
              placeholderTextColor={theme.iconColor}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
