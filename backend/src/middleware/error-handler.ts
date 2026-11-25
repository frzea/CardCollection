import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../lib/http-error.js";

// Обработчик ошибок — последним
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
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
}
