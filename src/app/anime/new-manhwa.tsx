import { createStyles } from "@/design-system/styles/new-manhwa";
import { FormInput } from "@/hooks/useController";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  titleEn: z.string().min(4, "Имя должно быть не короче 4 символов"),
  titleRom: z.string().min(4, "Имя должно быть не короче 4 символов"),
  description: z.string().min(4, "не мение4х символов").max(30, "не более 30 символов"),
  genres: z.string().min(4, " должно быть не короче 4 символов"),
  averageScore: z
    .string()
    .min(1, "минимум 1")
    .refine((val) => Number(val) >= 100, "больше 100 нельзя"),
  episodes: z.string().min(1, "минимум 1"),
});

type FormData = z.infer<typeof schema>;

export default function NewManhwa() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { titleEn: "", titleRom: "", description: "", genres: "", averageScore: "", episodes: "" },
  });

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
          <View style={[style.cover, style.coverPlaceholder]}>
            <Feather name="image" size={48} color={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Title (English)</Text>

            <TextInput style={style.input} placeholder="English title" placeholderTextColor={theme.iconColor} />
            <FormInput control={control} name="titleEn" placeholder="English title" style={style.input} placeholderTextColor={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Title (Romaji)</Text>
            <TextInput style={style.input} placeholder="Romaji title" placeholderTextColor={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Description</Text>
            <TextInput style={[style.input, style.multilineInput]} placeholder="Description" placeholderTextColor={theme.iconColor} multiline />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Genres</Text>
            <TextInput style={style.input} placeholder="Genres (comma separated)" placeholderTextColor={theme.iconColor} />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Average score</Text>
            <TextInput style={style.input} placeholder="Average score" placeholderTextColor={theme.iconColor} keyboardType="numeric" />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Episodes</Text>
            <TextInput style={style.input} placeholder="Episodes" placeholderTextColor={theme.iconColor} keyboardType="numeric" />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
