import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { Manhwa } from "../../../src/types/type.js";
import { manhwa } from "../data/manhwa.js";
import { HttpError } from "../http-error.js";

// Схема названия отдельно
const titleSchema = z.object({
  romaji: z.string().trim().min(4, "romaji is required"),
  english: z.string().trim().min(4).nullable(),
});

const manhwaBaseSchema = z.object({
  title: titleSchema,
  genres: z.array(z.string()),
  description: z.string().min(4, "At least 4 characters.").max(30, "No more than 30 characters."),
  averageScore: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 100").max(100, "From 1 to 100"),
  episodes: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 10").max(10, "From 1 to 10"),
});

export const manhwaRouter = Router();

manhwaRouter.get("/", (req, res) => {
  if (req.query.search) {
    return res.json(manhwa.filter((item) => item.title.english?.toLocaleLowerCase() === req.query.search?.toLocaleString().toLocaleLowerCase()));
  }
  res.json(manhwa);
});

manhwaRouter.get("/:id", (req, res) => {
  const row = manhwa.find((m) => m.id === req.params.id);
  if (!row) throw new HttpError(404, "Not found manhwa!");
  res.json(row);
});

manhwaRouter.post("/", (req, res) => {
  const createManhwaSchema = manhwaBaseSchema.extend({
    title: titleSchema.extend({
      english: titleSchema.shape.english.default(null),
    }),
    description: manhwaBaseSchema.shape.description.default(""),
    genres: manhwaBaseSchema.shape.genres.default([]),
  });

  const result = createManhwaSchema.safeParse(req.body);
  if (!result.success) throw new HttpError(400, result.error.issues[0].message);

  if (manhwa.find((m) => m.title.english === result.data.title.english)) throw new HttpError(409, "This entry already exists!");

  const created: Manhwa = {
    id: randomUUID(),
    coverImage: {
      large: null,
    },
    ...result.data,
  };

  manhwa.push(created);
  res.status(201).json(created);
});

manhwaRouter.patch("/:id", (req, res) => {
  const row = manhwa.find((m) => m.id === req.params.id);
  if (!row) throw new HttpError(404, "Not found manhwa!");

  const updates = manhwaBaseSchema.partial().safeParse(req.body);
  if (!updates.success) throw new HttpError(400, updates.error.issues[0].message);

  Object.assign(row, updates.data);

  res.json(row);
});

manhwaRouter.delete("/:id", (req, res) => {
  const index = manhwa.findIndex((m) => m.id === req.params.id);
  if (index === -1) throw new HttpError(404, "Not found manhwa!");

  manhwa.splice(index, 1);
  res.sendStatus(204);
});
