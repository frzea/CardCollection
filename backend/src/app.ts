import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/not-found.js";
import { manhwaRouter } from "./routes/manhwa.js";

export const app = express();

app.use(logger);
app.use(express.json()); // для чтения тела из запроса

app.use("/manhwa", manhwaRouter);

app.use(notFound);
app.use(errorHandler);
