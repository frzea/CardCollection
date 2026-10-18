import { z } from "zod";

const manhwaSchema = z.object({
  titleEn: z.string().min(4, "The name must be at least 4 characters long."),
  titleRom: z.string().min(4, "The name must be at least 4 characters long."),
  description: z.string().min(4, "At least 4 characters.").max(30, "No more than 30 characters."),
  genres: z
    .string()
    .transform((s) =>
      s
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string())
        .min(1, "Specify at least one genre.")
        .max(5, "No more than 5 genres.")
        .refine((arr) => arr.every((e) => e.length >= 3), "Each genre — minimum 3 characters."),
    ),
  averageScore: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 100").max(100, "From 1 to 100"),
  episodes: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 10").max(10, "From 1 to 10"),
});

type ManhwaFormInput = z.input<typeof manhwaSchema>;
type ManhwaFormOutput = z.output<typeof manhwaSchema>;

export { ManhwaFormInput, ManhwaFormOutput, manhwaSchema };

