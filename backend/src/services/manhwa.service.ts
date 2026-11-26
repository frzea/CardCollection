import { randomUUID } from "node:crypto";
import { Manhwa } from "../../../src/types/type.js";
import { manhwa } from "../data/manhwa.js";
import { HttpError } from "../lib/http-error.js";
import { CreateManhwaInput, UpdateManhwaInput } from "../schemas/manhwa.js";

export function listManhwa(search?: string): Manhwa[] {
  if (!search) return manhwa;
  const query = search.toLocaleLowerCase();

  return manhwa.filter((m) => {
    const romaji = m.title.romaji.toLocaleLowerCase();
    const english = m.title.english?.toLocaleLowerCase() ?? "";
    return english.includes(query) || romaji.includes(query);
  });
}

export function getManhwa(id: string): Manhwa {
  const row = manhwa.find((m) => m.id === id);
  if (!row) throw new HttpError(404, "Not found manhwa!");

  return row;
}

export function createManhwa(data: CreateManhwaInput): Manhwa {
  if (manhwa.find((m) => m.title.romaji.toLocaleLowerCase() === data.title.romaji.toLocaleLowerCase()))
    throw new HttpError(409, "This entry already exists!");

  const created: Manhwa = { id: randomUUID(), ...data };

  manhwa.push(created);
  return created;
}

export function updsateManhwa(id: string, data: UpdateManhwaInput): Manhwa {
  const row = getManhwa(id);
  Object.assign(row, data);
  return row;
}

export function deleteManhwa(id: string): void {
  const index = manhwa.findIndex((m) => m.id === id);
  if (index === -1) throw new HttpError(404, "Not found manhwa!");

  manhwa.splice(index, 1);
}
