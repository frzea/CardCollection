import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Ошибка в переменных окружения:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1); // остановить процесс с кодом ошибки
}

export const config = parsed.data;
