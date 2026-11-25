import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { Manhwa } from "../../../src/types/type.js";
import { manhwa } from "../data/manhwa.js";
import { HttpError } from "../lib/http-error.js";
import { createManhwaSchema, listQuerySchema, manhwaBaseSchema } from "../schemas/manhwa.js";

export const manhwaRouter = Router();

manhwaRouter.get("/", (req, res) => {
  if (req.query.search) {
    const { search } = listQuerySchema.parse(req.query);
    const query = search?.toLowerCase() ?? "";

    return res.json(
      manhwa.filter((item) => {
        const english = item.title.english?.toLowerCase() ?? "";
        const romaji = item.title.romaji?.toLowerCase() ?? "";
        return english.includes(query) || romaji.includes(query);
      }),
    );
  }
  res.json(manhwa);
});

manhwaRouter.get("/:id", (req, res) => {
  const row = manhwa.find((m) => m.id === req.params.id);
  if (!row) throw new HttpError(404, "Not found manhwa!");
  res.json(row);
});

manhwaRouter.post("/", (req, res) => {
  const result = createManhwaSchema.safeParse(req.body);
  if (!result.success) throw new HttpError(400, result.error.issues[0].message);

  if (manhwa.find((m) => m.title.romaji.toLocaleLowerCase() === result.data.title.romaji.toLocaleLowerCase()))
    throw new HttpError(409, "This entry already exists!");

  const created: Manhwa = {
    id: randomUUID(),
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
