import type { NextFunction, Request, Response } from "express";
import express from "express";
import { z } from "zod";
import { HttpError } from "./http-error.js";
import { manhwaRouter } from "./routes/manhwa.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

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

app.use("/manhwa", manhwaRouter);

// ============================================================
// LISTENING AND CLOSING OTHER ROUTES
// ============================================================

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Обработчик ошибок — последним
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.issues[0].message });
    return;
  }
  console.error(err); // неожиданная ошибка — в лог, клиенту без подробностей
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
