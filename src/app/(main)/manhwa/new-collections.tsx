import { useAddCollection } from "@/api/queries/mutations";
import { uploadImage } from "@/api/upload";
import { FormInput } from "@/components/formInput";
import { colors } from "@/design-system";
import { createStyles } from "@/design-system/styles/new-manhwa";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useTheme } from "@/hooks/useTheme";
import { CollectionFormInput, CollectionFormOutput, collectionSchema } from "@/schemas/collection";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function NewCollection() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { id: manhwaId } = useLocalSearchParams<{ id: string }>();
  const { image: selectedImage, pick } = useImagePicker();
  const addCollection = useAddCollection();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormInput, unknown, CollectionFormOutput>({
    resolver: zodResolver(collectionSchema),
    mode: "onBlur",
    defaultValues: { title: "", description: "", cards: "" },
  });

  const onSabmit = async (data: CollectionFormOutput) => {
    let coverImageUrl = "";

    try {
      if (selectedImage) {
        coverImageUrl = await uploadImage(selectedImage);
      }

      await addCollection.mutateAsync({
        manhwaId: manhwaId,
        title: data.title,
        cards: data.cards,
        description: data.description,
        image: coverImageUrl,
      });

      router.back();
    } catch {
      setError("root", { message: "Ошибка загрузки колекции!" });
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
            <FormInput control={control} name="title" placeholder="English title" style={style.input} placeholderTextColor={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Cards</Text>
            <FormInput
              control={control}
              name="cards"
              placeholder="qty cards"
              style={style.input}
              placeholderTextColor={theme.iconColor}
              keyboardType="numeric"
            />
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
