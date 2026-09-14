import { createStyles } from "@/design-system/styles/new-manhwa";
import { useTheme } from "@/hooks/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function NewManhwa() {
  const { theme, colorScheme } = useTheme();
  const style = useMemo(() => createStyles(theme), [theme]);
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
            <TextInput
              style={style.input}
              placeholder="English title"
              placeholderTextColor={theme.iconColor}
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Title (Romaji)</Text>
            <TextInput
              style={style.input}
              placeholder="Romaji title"
              placeholderTextColor={theme.iconColor}
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Description</Text>
            <TextInput
              style={[style.input, style.multilineInput]}
              placeholder="Description"
              placeholderTextColor={theme.iconColor}
              multiline
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Genres</Text>
            <TextInput
              style={style.input}
              placeholder="Genres (comma separated)"
              placeholderTextColor={theme.iconColor}
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Average score</Text>
            <TextInput
              style={style.input}
              placeholder="Average score"
              placeholderTextColor={theme.iconColor}
              keyboardType="numeric"
            />
          </View>

          <View style={style.field}>
            <Text style={style.label}>Episodes</Text>
            <TextInput
              style={style.input}
              placeholder="Episodes"
              placeholderTextColor={theme.iconColor}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
