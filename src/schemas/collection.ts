import { z } from "zod";

const collectionSchema = z.object({
  title: z.string().min(4, "The name must be longer than 4 characters."),
  description: z.string().min(4, "At least 4 characters.").max(30, "No more than 30 characters."),
  cards: z
    .string()
    .trim()
    .min(1, "Field is required")
    .pipe(z.coerce.number<string>({ error: "Enter a number" }).int("Number must be int").min(1, "Min 1.").max(32, "Max 32.")),
  // Дата выхода в формате ГГГГ-ММ-ДД: такие строки сортируются так же, как даты
  releaseDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .refine((s) => {
      const d = new Date(`${s}T00:00:00Z`);
      // toISOString отсекает несуществующие даты вроде 2024-02-31
      return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
    }, "Invalid date"),
});

type CollectionFormInput = z.input<typeof collectionSchema>;
type CollectionFormOutput = z.output<typeof collectionSchema>;

export { collectionSchema };
export type { CollectionFormInput, CollectionFormOutput };
