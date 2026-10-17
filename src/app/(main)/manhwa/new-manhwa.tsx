import { useAddManhwa } from "@/api/queries/mutations";
import { uploadImage } from "@/api/upload";
import { FormInput } from "@/components/formInput";
import { colors } from "@/design-system";
import { createStyles } from "@/design-system/styles/new-manhwa";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  titleEn: z.string().min(4, "The name must be at least 4 characters long."),
  titleRom: z.string().min(4, "The name must be at least 4 characters long."),
  description: z.string().min(4, "At least 4 characters.").max(30, "No more than 30 characters."),
  genres: z.string().min(4, " должно быть не короче 4 символов"), //z.array(z.string().min(4, " должно быть не короче 4 символов")).max(5),
  averageScore: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 100").max(100, "From 1 to 100"),
  episodes: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 10").max(10, "From 1 to 10"),
});

type FormInputData = z.input<typeof schema>;
type FormOutputData = z.output<typeof schema>;

export default function NewManhwa() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { image: selectedImage, pick } = useImagePicker();
  const addManhwa = useAddManhwa();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInputData, unknown, FormOutputData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { titleEn: "", titleRom: "", description: "", genres: "", averageScore: "", episodes: "" },
  });

  const onSabmit = async (data: FormOutputData) => {
    let coverImageUrl = "";

    try {
      if (selectedImage) {
        coverImageUrl = await uploadImage(selectedImage);
      }
      await addManhwa.mutateAsync({
        title: { english: data.titleEn, romaji: data.titleRom },
        description: data.description,
        coverImage: { large: coverImageUrl },
        genres: data.genres.split(",").map((g) => g.trim()),
        averageScore: Number(data.averageScore),
        episodes: Number(data.episodes),
      });

      router.back();
    } catch (e) {
      setError("root", { message: "Ошибка загрузки манхвы!" });
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
          <TouchableOpacity onPress={pick}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={style.cover} resizeMode="cover" />
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

          {errors.root && <Text style={style.error}>{errors.root.message}</Text>}
          <TouchableOpacity
            style={[style.button, isSubmitting && style.buttonDisabled]}
            activeOpacity={0.8}
            disabled={isSubmitting}
            onPress={handleSubmit(onSabmit, (errors) => console.log(errors))}
          >
            {isSubmitting ? <ActivityIndicator color={colors.white} /> : <Text style={style.buttonText}>Create</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}
