import { apiPOST } from "@/api/events";
import { useCollection } from "@/api/queries/queries";
import { uploadImage } from "@/api/upload";
import { colors } from "@/design-system";
import { createStyles } from "@/design-system/styles/new-manhwa";
import { FormInput } from "@/hooks/useController";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useTheme } from "@/hooks/useTheme";
import { Collections } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(4, "Имя должно быть не короче 4 символов"),
  description: z.string().min(4, "не мение4х символов").max(30, "не более 30 символов"),
  cards: z
    .string()
    .min(1, "минимум 1")
    .refine((val) => Number(val) <= 100, "больше 100 нельзя"),
});
type FormData = z.infer<typeof schema>;

export default function NewCollection() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
  const { id: manhwaId } = useLocalSearchParams<{ id: string }>();
  const { image: selectedImage, pick } = useImagePicker();
  const { data: manhwaCollectionsData } = useCollection(manhwaId);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { title: "", description: "", cards: "" },
  });

  const createMutatons = useMutation({
    mutationFn: (existing: Omit<Collections, "id">) => apiPOST<Collections>("collections", existing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const onSabmit = async (data: FormData) => {
    let coverImageUrl = "";
    if (selectedImage) {
      coverImageUrl = await uploadImage(selectedImage);
    }

    let numberCollection = (manhwaCollectionsData?.length ?? 0) + 1;

    createMutatons.mutate({
      manhwaId: manhwaId,
      number: numberCollection,
      title: data.title,
      cards: data.cards,
      description: data.description,
      image: coverImageUrl,
    });
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
            <FormInput control={control} name="cards" placeholder="qty cards" style={style.input} placeholderTextColor={theme.iconColor} />
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
