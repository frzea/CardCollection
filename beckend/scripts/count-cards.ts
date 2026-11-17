import fs from "node:fs/promises";
import path from "node:path";

const filePath = process.env.DB_PATH;

try {
  if (!filePath) throw Error("No path in .env");

  const file = path.join(filePath, "db.json");
  const data = await fs.readFile(file, "utf-8");

  const db = JSON.parse(data);

  console.log(data);
} catch (err) {
  if (err instanceof Error && "code" in err && err.code === "ENOENT") {
    console.error("Файл не найден:");
  } else {
    console.error(err);
  }
}
