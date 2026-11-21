import fs from "node:fs/promises";
import path from "node:path";

const file = path.join(import.meta.dirname, "main.tsx");

const text = await fs.readFile(file, "utf-8");

console.log(text);
