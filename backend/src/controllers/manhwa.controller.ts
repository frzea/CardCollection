import type { Request, Response } from "express";
import { createManhwaSchema, listQuerySchema, manhwaBaseSchema } from "../schemas/manhwa.js";
import * as manhwaService from "../services/manhwa.service.js";

export function list(req: Request, res: Response) {
  const { search } = listQuerySchema.parse(req.query);
  res.json(manhwaService.listManhwa(search));
}

export function getOne(req: Request<{ id: string }>, res: Response) {
  res.json(manhwaService.getManhwa(req.params.id));
}

export function create(req: Request, res: Response) {
  const data = createManhwaSchema.parse(req.body);
  res.json(manhwaService.createManhwa(data));
}

export function update(req: Request<{ id: string }>, res: Response) {
  const data = manhwaBaseSchema.parse(req.body);
  res.json(manhwaService.updsateManhwa(req.params.id, data));
}

export function remuve(req: Request<{ id: string }>, res: Response) {
  manhwaService.deleteManhwa(req.params.id);
  res.sendStatus(204);
}
