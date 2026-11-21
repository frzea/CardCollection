import express from "express";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use((req, res, next) => {
  const start = Date.now();

  // "finish" — событие: ответ полностью отправлен
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms} ms)`);
  });

  next(); // без этого запрос зависнет навсегда
});

app.use(express.json()); // для чтения тела из запроса

//app.use(middleware);

app.get("/test", (req, res) => {
  res.json({ ok: 1 });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
