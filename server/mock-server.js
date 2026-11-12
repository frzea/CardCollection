const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const db = router.db;
const middlewares = jsonServer.defaults();
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_TTL = "7d"; // на этапе 2 (refresh) станет "15m"
const ADMIN_ROLE = 1;
const WRITE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Create server/.env");
}

const uploadsDir = path.join(__dirname, "..", "public", "images", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // максимум 5 МБ на файл
});

server.use(middlewares);

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
}

// Достаёт токен из заголовка "Authorization: Bearer <токен>"
function getTokenFromRequest(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

// Создаёт access-токен для юзера
function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role }, // payload: кто и с какой ролью
    JWT_SECRET, // подпись секретом
    { expiresIn: ACCESS_TOKEN_TTL }, // jwt сам добавит в payload поле exp
  );
}

// Проверяет токен. Возвращает payload или null, если токен битый/просрочен
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

server.use(jsonServer.bodyParser);

// Middleware
server.use((req, res, next) => {
  if (req.method === "POST" && PUBLIC_ROUTES.includes(req.path)) return next();

  const token = getTokenFromRequest(req);
  const payload = token && verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  req.user = { id: payload.sub, role: payload.role };
  next();
});

// Изменять каталог (манхвы, коллекции, карточки, картинки) может только админ.
// Читать (GET) может любой залогиненный.
server.use(["/manhwa", "/collections", "/cards", "/upload"], (req, res, next) => {
  if (WRITE_METHODS.includes(req.method) && req.user.role !== ADMIN_ROLE) {
    return res.status(403).json({ error: "Only for sa." });
  }
  next();
});

// Таблицу ролей клиент только читает (а скорее всего и это ему не нужно)
server.use("/roles", (req, res, next) => {
  if (req.method !== "GET") return res.sendStatus(403);
  next();
});

server.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ path: `/images/uploads/${req.file.filename}` });
});

// ----- AUTH -----

// 1. Вход: логин + пароль -> токен
server.post("/auth/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    if (typeof login !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Нужны login и password" });
    }

    const user = db.get("users").find({ login: login.trim().toLowerCase() }).value();
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    res.json({
      accessToken: signAccessToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.post("/auth/register", async (req, res) => {
  try {
    const { login, name, password } = req.body;

    if (typeof login !== "string" || typeof name !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid field type" });
    }

    const cleanLogin = login.trim().toLowerCase();
    const cleanName = name.trim();

    if (!/^[a-z0-9_]{3,20}$/.test(cleanLogin)) {
      return res.status(400).json({ error: "Login: 3–20 characters, Latin, numbers, _", field: "login" });
    }

    if (cleanName.length < 1 || cleanName.length > 50) {
      return res.status(400).json({ error: "Name: 1 to 50 characters", field: "name" });
    }

    if (password.length < 6 || password.length > 72) {
      return res.status(400).json({ error: "Password: 6 to 72 characters", field: "password" });
    }

    const exists = db.get("users").find({ login: cleanLogin }).value();
    if (exists) {
      return res.status(409).json({ error: "Username is already taken", field: "login" });
    }

    // id числом, как у остальных юзеров: с ним сравнивается userId в userCards
    const ids = db.get("users").map("id").value();
    const user = {
      id: ids.length ? Math.max(...ids) + 1 : 1,
      login: cleanLogin,
      name: cleanName,
      passwordHash: await bcrypt.hash(password, 10),
      role: 2, // всегда обычный юзер, поле role из тела игнорируем
    };
    db.get("users").push(user).write(); // без write() юзер пропадёт после перезапуска

    res.status(201).json({
      accessToken: signAccessToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Кто я: проверяет токен и возвращает юзера
server.get("/auth/me", (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: "Нет токена" });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Токен недействителен" });
  }

  const user = db.get("users").find({ id: payload.sub }).value();
  if (!user) {
    return res.status(401).json({ error: "Пользователь не найден" });
  }

  res.json(publicUser(user));
});

// 3. Выход: на этапе 1 сервер ничего не хранит, просто подтверждаем
server.post("/auth/logout", (req, res) => {
  res.sendStatus(204);
});

server.use(["/users", "/sessions"], (req, res) => {
  res.sendStatus(403);
});

// Номер присваивает сервер: следующий после максимального внутри группы
function nextNumber(table, filter) {
  const numbers = db.get(table).filter(filter).map("number").value();
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

server.post("/collections", (req, res, next) => {
  if (!req.body.manhwaId) return res.status(400).json({ error: "Нужен manhwaId" });
  // Порядок коллекций — по дате выхода, формат ГГГГ-ММ-ДД (сортируется как строка)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.releaseDate || "")) {
    return res.status(400).json({ error: "Нужен releaseDate в формате ГГГГ-ММ-ДД" });
  }
  next(); // дальше запись делает обычный json-server router
});

server.post("/cards", (req, res, next) => {
  if (!req.body.collectionId) return res.status(400).json({ error: "Нужен collectionId" });
  req.body.number = nextNumber("cards", { collectionId: req.body.collectionId });

  const collection = db.get("collections").find({ id: req.body.collectionId }).value();
  if (!collection) return res.status(400).json({ error: "Коллекция не найдена" });

  const count = db.get("cards").filter({ collectionId: req.body.collectionId }).size().value();
  if (count >= Number(collection.cards)) {
    return res.status(409).json({ error: "Коллекция уже заполнена" });
  }
  next();
});

server.get("/userCards", (req, res, next) => {
  req.query.userId = String(req.user.id); // свои карточки, что бы ни прислал клиент
  next();
});

// Таблицу userCards напрямую можно только читать: менять — через /me/cards/:cardId
server.use("/userCards", (req, res, next) => {
  if (req.method !== "GET") return res.sendStatus(405);
  next();
});

// +1 копия карточки. Клиент говорит только «какую карточку», остальное сервер считает сам
server.post("/me/cards/:cardId", (req, res) => {
  const card = db.get("cards").find({ id: req.params.cardId }).value();
  if (!card) return res.status(404).json({ error: "Карточка не найдена" });

  const collection = db.get("collections").find({ id: card.collectionId }).value();
  if (!collection) return res.status(409).json({ error: "Коллекция карточки не найдена" });

  const userCards = db.get("userCards");
  // ищем по паре (юзер, карточка): так у одной карточки не бывает двух строк
  const row = userCards.find({ userId: req.user.id, cardId: card.id }).value();

  if (row) {
    // +1 считает сервер от своего значения: два устройства не затрут друг друга
    const updated = userCards
      .find({ id: row.id })
      .assign({ count: row.count + 1 })
      .write();
    return res.json(updated);
  }

  const ids = userCards.map("id").value();
  const created = {
    id: ids.length ? Math.max(...ids) + 1 : 1,
    userId: req.user.id, // из токена
    cardId: card.id,
    collectionId: card.collectionId, // из карточки, а не из запроса
    manhwaId: collection.manhwaId, // из коллекции
    count: 1,
  };
  userCards.push(created).write();
  res.status(201).json(created);
});

// −1 копия карточки. Последняя копия — удаляем строку
server.delete("/me/cards/:cardId", (req, res) => {
  const userCards = db.get("userCards");
  const row = userCards.find({ userId: req.user.id, cardId: req.params.cardId }).value();
  if (!row) return res.status(404).json({ error: "Этой карточки у тебя нет" });

  if (row.count > 1) {
    const updated = userCards
      .find({ id: row.id })
      .assign({ count: row.count - 1 })
      .write();
    return res.json(updated);
  }

  userCards.remove({ id: row.id }).write();
  res.sendStatus(204);
});

server.use("/userCards/:id", (req, res, next) => {
  const row = db
    .get("userCards")
    .find({ id: Number(req.params.id) })
    .value();
  if (!row) return res.sendStatus(404);
  if (row.userId !== req.user.id) return res.sendStatus(403); // чужая запись
  next();
});

// Манхвы, в которых у юзера есть карточки, + прогресс сбора
server.get("/me/manhwas", (req, res) => {
  const userCards = db.get("userCards").filter({ userId: req.user.id }).value();

  // одна строка userCards = одна уникальная карточка, count копий не важен
  const owned = new Map();
  for (const uc of userCards) owned.set(uc.manhwaId, (owned.get(uc.manhwaId) ?? 0) + 1);

  const result = db
    .get("manhwa")
    .filter((m) => owned.has(m.id))
    .value()
    .map((m) => {
      const total = db
        .get("collections")
        .filter({ manhwaId: m.id })
        .sumBy((c) => Number(c.cards))
        .value();
      return { ...m, owned: owned.get(m.id), total };
    });

  res.json(result);
});

// json-server умеет больше, чем нужно приложению: вложенные маршруты и подгрузка связей обходят наши проверки
server.use((req, res, next) => {
  if ("_embed" in req.query || "_expand" in req.query) return res.sendStatus(400);
  // приложению хватает /таблица и /таблица/:id — всё глубже запрещаем
  if (req.path.split("/").filter(Boolean).length > 2) return res.sendStatus(404);
  next();
});

server.use(router);

const PORT = 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock server (json-server + upload) running on http://0.0.0.0:${PORT}`);
});
