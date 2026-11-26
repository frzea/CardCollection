import { Router } from "express";
import * as manhwaController from "../controllers/manhwa.controller.js";

export const manhwaRouter = Router();

manhwaRouter.get("/", manhwaController.list);

manhwaRouter.get("/:id", manhwaController.getOne);

manhwaRouter.post("/", manhwaController.create);

manhwaRouter.patch("/:id", manhwaController.update);

manhwaRouter.delete("/:id", manhwaController.remuve);
