import express from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { Manhwa } from "../../src/types/type.js";
import { HttpError } from "./http-error.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const manhwa: Manhwa[] = [
  {
    id: "16498",
    title: {
      romaji: "Shingeki no Kyojin",
      english: "Melting Point",
    },
    description: "",
    coverImage: {
      large: null,
    },
    genres: ["Action", "Drama", "Fantasy", "Mystery"],
    averageScore: 85,
    episodes: 25,
  },
  {
    id: "101922",
    title: {
      romaji: "Behind the Scenes",
      english: "Behind the Scenes",
    },
    description: "",
    coverImage: {
      large: "https://cdn.nextchapter.moe/covers/series/2eeb749a-afa8-4ce9-bfe1-d8db0251e296/original/7083df39d541b86a.jpg",
    },
    genres: ["Action", "Adventure", "Drama", "Fantasy", "Supernatural"],
    averageScore: 83,
    episodes: 26,
  },
];

const createManhwaSchema = z.object({
  title: z.object({
    romaji: z.string().trim().min(4),
    english: z.string().trim().min(4),
  }),
  description: z.string().min(4, "At least 4 characters.").max(30, "No more than 30 characters."),
  averageScore: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 100").max(100, "From 1 to 100"),
  episodes: z.coerce.number({ error: "Not number." }).int().min(1, "From 1 to 10").max(10, "From 1 to 10"),
});

app.use((req, res, next) => {
  const start = Date.now();

  // "finish" — событие: ответ полностью отправлен
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms} ms)`);
  });

  next();
});

app.use(express.json()); // для чтения тела из запроса

app.get("/manhwa", (req, res) => {
  if (req.query.search) {
    return res.json(manhwa.filter((item) => item.title.english?.toLocaleLowerCase() === req.query.search?.toLocaleString().toLocaleLowerCase()));
  }
  res.json(manhwa);
});

app.get("/manhwa/:id", (req, res) => {
  const row = manhwa.find((m) => m.id === req.params.id);
  if (!row) return res.status(404).json({ error: "Not found manhwa!" });
  res.json(row);
});

app.post("/manhwa", (req, res) => {
  const result = createManhwaSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0].message);
  }

  if (manhwa.find((m) => m.title.english === result.data.title.english)) {
    throw new HttpError(409, "This entry already exists!");
  }

  const created: Manhwa = {
    id: randomUUID(),
    coverImage: {
      large: null,
    },
    genres: ["Action", "Drama", "Fantasy", "Mystery"],

    ...result.data,
  };

  manhwa.push(created);

  res.status(201).json(created);
});

// ============================================================
// LISTENING AND CLOSING OTHER ROUTES
// ============================================================

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
