const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const multer = require("multer");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const uploadsDir = path.join(__dirname, "..", "public", "cards", "uploads");
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

server.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ path: `/cards/uploads/${req.file.filename}` });
});

server.use(router);

const PORT = 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock server (json-server + upload) running on http://0.0.0.0:${PORT}`);
});
