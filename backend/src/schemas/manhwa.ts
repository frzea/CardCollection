import { z } from "zod";

// Схема названия отдельно
const titleSchema = z.object({
  romaji: z.string().trim().min(4, "romaji is required"),
  english: z.string().trim().min(4).nullable(),
});

const imageSchema = z.object({
  large: z.string().nullable(),
});

const manhwaBaseSchema = z.object({
  title: titleSchema,
  coverImage: imageSchema,
  genres: z.array(z.string()),
  description: z.string().min(4, "At least 4 characters.").max(30, "No more than 30 characters."),
  averageScore: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 100").max(100, "From 1 to 100"),
  episodes: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 10").max(10, "From 1 to 10"),
});

const createManhwaSchema = manhwaBaseSchema.extend({
  title: titleSchema.extend({
    english: titleSchema.shape.english.default(null),
  }),
  coverImage: imageSchema.default({ large: null }),
  description: manhwaBaseSchema.shape.description.default(""),
  genres: manhwaBaseSchema.shape.genres.default([]),
});

const listQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export { createManhwaSchema, listQuerySchema, manhwaBaseSchema };

