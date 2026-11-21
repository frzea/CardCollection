import fs from "node:fs/promises";
import path from "node:path";
import type { Cards, Collections, User, UserCard } from "../../src/types/type.js";

const filePath = process.env.DB_PATH;

try {
  if (!filePath) throw Error("No path in .env");

  const file = path.join(filePath, "db.json");
  const data = await fs.readFile(file, "utf-8");

  const db = JSON.parse(data);
  const collections: Collections[] = db.collections;
  const cards: Cards[] = db.cards;

  collections.forEach((col) => {
    const uploaded = cards.filter((c) => c.collectionId === col.id).length;
    const total = col.cards;
    const mark = uploaded > total ? " ⚠️" : uploaded === total ? " ✅" : "";
    console.log(`${col.title} : ${uploaded} /${total} ${mark}`);
  });

  const users: User[] = db.users;
  const userCards: UserCard[] = db.userCards;

  const status = users.map((item) => {
    const count = userCards.filter((f) => item.id === f.userId).length;
    return { name: item.name, count };
  });

  status.sort((a, b) => b.count - a.count);

  const top3 = status.slice(0, 3);

  console.log("Топ-3 коллекционеров:");
  top3.forEach((u, i) => {
    console.log(`${i + 1}. ${u.name} — ${u.count} карточек`);
  });

  await fs.writeFile(path.join(import.meta.dirname, "status.json"), JSON.stringify(top3, null, 2));
} catch (err) {
  if (err instanceof Error && "code" in err && err.code === "ENOENT") {
    console.error("Файл не найден:", filePath);
  } else {
    console.error(err);
  }
}
