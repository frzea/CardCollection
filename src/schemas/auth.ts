import { z } from "zod";

const authSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type AuthFormData = z.infer<typeof authSchema>;

const registerSchema = z
  .object({
    login: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_]{3,20}$/, "Login: 3–20 characters, Latin, numbers, _"),
    name: z.string().trim().min(1, "Enter name").max(50, "Max 50 characters"),
    password: z.string().trim().min(6, "Min 6 characters").max(72, "Max 72 characters"),
    passwordRepeat: z.string(),
  })
  .refine((d) => d.password === d.passwordRepeat, { message: "Passwords do not match.", path: ["passwordRepeat"] });

type RegisterFormData = z.infer<typeof registerSchema>;

export { AuthFormData, authSchema, RegisterFormData, registerSchema };

