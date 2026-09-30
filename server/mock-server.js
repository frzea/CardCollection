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

server.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ path: `/images/uploads/${req.file.filename}` });
});

server.use(router);

const PORT = 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock server (json-server + upload) running on http://0.0.0.0:${PORT}`);
});
