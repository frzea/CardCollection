import { z } from "zod";

const authSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type AuthFormData = z.infer<typeof authSchema>;

export { AuthFormData, authSchema };

